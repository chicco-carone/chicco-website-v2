"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, Star, GitFork, Calendar, Code, GitCommit } from "lucide-react";
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

interface OpenSourceContributionsProps {
  repos: string[]; // e.g. ["owner/name", "owner/name2"]
}

export function OpenSourceContributions({ repos }: OpenSourceContributionsProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRepos = async () => {
      try {
        const res = await fetch(`/api/github-repos?repos=${repos.join(',')}`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRepositories(data);
          setError(null);
        }
      } catch (e) {
        console.error("Error loading repositories:", e);
        if (!cancelled) {
          setRepositories([]);
          setError(String(e));
        }
      }
    };
    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, [repos]);

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
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Code className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Open Source Contributions</h3>
          <p className="text-sm text-gray-400">Projects I&apos;ve contributed to</p>
        </div>
      </div>

      {error ? (
        <p className="text-red-400 text-sm">Error loading repositories: {error}</p>
      ) : (
        <div className="space-y-4">
          {repositories.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
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
                  <motion.a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        </div>
      )}
    </Card>
  );
}
