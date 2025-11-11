import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { z } from "zod";

export const dynamic = "force-dynamic";

const GitHubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string(),
  location: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
});

// Cached function to fetch GitHub user profile
const fetchGitHubProfile = unstable_cache(
  async (username: string) => {
    const githubUrl = `https://api.github.com/users/${username}`;
    const response = await fetch(githubUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Website/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const result = await response.json();

    // Validate the response with Zod
    const validatedUser = GitHubUserSchema.parse(result);
    return validatedUser;
  },
  ['github-profile'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['github']
  }
);

export async function GET() {
  const username = "chicco-carone";

  try {
    // Use cached GitHub profile data
    const userData = await fetchGitHubProfile(username);

    // Transform to match client expectations
    const profile = {
      name: userData.name ?? userData.login,
      username: userData.login,
      avatar: userData.avatar_url,
      location: userData.location ?? null,
      publicRepos: userData.public_repos ?? 0,
      followers: userData.followers ?? 0,
    };

    const apiResponse = NextResponse.json(profile);

    // Cache for 30 minutes
    apiResponse.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=300");

    return apiResponse;
  } catch (err) {
    console.error("GitHub Profile API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub profile data" },
      { status: 500 }
    );
  }
}
