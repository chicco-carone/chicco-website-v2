import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { z } from "zod";

export const dynamic = "force-dynamic";

const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  html_url: z.string(),
  updated_at: z.string(),
  topics: z.array(z.string()).optional(),
  private: z.boolean().optional(),
  recentCommitsCount: z.number().nullable(),
});

// Helper function to fetch recent commits count
const fetchRecentCommitsCount = async (fullName: string): Promise<number | null> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();

    const commitsUrl = `https://api.github.com/repos/${fullName}/commits?since=${since}&per_page=100`;
    const response = await fetch(commitsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Website/1.0)',
      },
    });

    if (!response.ok) {
      // If commits API fails, return null instead of failing the whole request
      return null;
    }

    const commits = await response.json();
    return Array.isArray(commits) ? commits.length : 0;
  } catch (error) {
    // Silently fail for commits, don't break repo fetching
    console.warn(`Failed to fetch commits for ${fullName}:`, error);
    return null;
  }
};

// Cached function to fetch GitHub repositories
const fetchGitHubRepos = unstable_cache(
  async (repos: string[]) => {
    const results = await Promise.all(
      repos.map(async (fullName) => {
        const githubUrl = `https://api.github.com/repos/${fullName}`;
        const response = await fetch(githubUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Website/1.0)',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${fullName}: ${response.status}`);
        }

        const result = await response.json();

        // Fetch recent commits count
        const recentCommitsCount = await fetchRecentCommitsCount(fullName);

        return GitHubRepoSchema.parse({
          ...result,
          recentCommitsCount,
        });
      })
    );

    // Exclude private repos and return
    return results.filter((r) => !r.private);
  },
  ['github-repos'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['github']
  }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reposParam = searchParams.get("repos");

  if (!reposParam) {
    return NextResponse.json(
      { error: "Missing repos parameter" },
      { status: 400 }
    );
  }

  const repos = reposParam.split(",").map(r => r.trim());

  try {
    // Use cached GitHub repos data
    const reposData = await fetchGitHubRepos(repos);

    const apiResponse = NextResponse.json(reposData);

    // Cache for 30 minutes
    apiResponse.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=300");

    return apiResponse;
  } catch (err) {
    console.error("GitHub Repos API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories data" },
      { status: 500 }
    );
  }
}
