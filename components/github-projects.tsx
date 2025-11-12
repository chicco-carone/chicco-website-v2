/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, GitFork, Calendar, Code, GitCommit } from "lucide-react";
import { unstable_cache } from "next/cache";
import { AnimatedCard } from "./animated-card";

type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  topics?: string[];
  private?: boolean;
  recentCommitsCount: number | null;
};

interface GitHubProjectsProps {
  repos: string[]; // e.g. ["owner/name", "owner/name2"]
}

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
      return null;
    }

    const commits = await response.json();
    return Array.isArray(commits) ? commits.length : 0;
  } catch (error) {
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
        const recentCommitsCount = await fetchRecentCommitsCount(fullName);

        return {
          ...result,
          recentCommitsCount,
        };
      })
    );

    return results.filter((r) => !r.private);
  },
  ['github-repos-server'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
  }
);

export async function GitHubProjects({ repos }: GitHubProjectsProps) {
  let repositories: Repository[] = [];
   
  let error: string | null = null;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  try {
    repositories = await fetchGitHubRepos(repos);
  } catch (err) {
    error = String(err);
    console.error("Error loading repositories:", error);
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      Python: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Shell: "bg-green-500",
      JavaScript: "bg-yellow-400",
      HTML: "bg-orange-500",
      CSS: "bg-blue-400",
      Java: "bg-red-500",
    };
    return colors[language || ""] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // no loading state needed for static content

  return (
    <Card className="p-6 bg-black/20 border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Code className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Featured Projects</h3>
          <p className="text-sm text-gray-400">GitHub Repositories</p>
        </div>
      </div>

      {error ? (
        <p className="text-red-400 text-sm">Error loading repositories: {error}</p>
      ) : (
        <div className="space-y-4">
          {repositories.map((repo, index) => (
          <AnimatedCard key={repo.id} index={index} className="group">
            <Card className="p-4 bg-black/40 border-white/5 hover:border-white/20 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
                    />
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {repo.name}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <span title="Stars"><Star className="h-3 w-3" /></span>
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span title="Forks"><GitFork className="h-3 w-3" /></span>
                        <span>{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span title="Commits (last 30 days)"><GitCommit className="h-3 w-3" /></span>
                        <span>{repo.recentCommitsCount ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span title="Last updated"><Calendar className="h-3 w-3" /></span>
                        <span>{formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {repo.description}
                  </p>

                  {repo.topics && (
                    <div className="flex flex-wrap gap-2">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" size="icon" className="ml-4">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </AnimatedCard>
        ))}
        </div>
      )}
    </Card>
  );
}
