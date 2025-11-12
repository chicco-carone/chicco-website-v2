"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/main/navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WakaTimeStats } from "@/components/wakatime-stats";
import { GitHubProjects } from "@/components/github-projects";
import { OpenSourceContributions } from "@/components/open-source-contributions";
import { UserImage } from "@/components/user-image";
import { motion } from "framer-motion";
import { Github, MapPin, FolderGit2, Users } from "lucide-react";

export default function DevWork() {
	// Runtime profile data fetched from GitHub API
	type Profile = {
		name: string;
		username: string;
		avatar: string;
		location?: string | null;
		publicRepos: number;
		followers: number;
	};

	const [profile, setProfile] = useState<Profile | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Choose which repositories to feature (public repos only)
	const featuredRepos = [
		"chicco-carone/Power-Load-Balancer",
		"chicco-carone/Snapcast-Gui",
		"chicco-carone/remove-all-comments",
	];

	// Choose which open source projects you've contributed to
	const contributionRepos = [
		"music-assistant/server",
		"badaix/snapweb",
		"badaix/snapcast",
	];

	useEffect(() => {
		let mounted = true;

		const fetchProfile = async () => {
			try {
				const res = await fetch("/api/github-profile");
				if (!res.ok) throw new Error(`API returned ${res.status}`);
				const data = await res.json();
				if (mounted) {
					setProfile(data);
					setError(null);
				}
			} catch (err: unknown) {
				if (mounted) setError(String(err));
				console.error("Error fetching profile:", err);
			}
		};

	// Initial fetch
	fetchProfile();
	return () => {
		mounted = false;
	};
	}, []);

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-black text-white">
				<section className="mx-auto max-w-5xl px-4 py-10 md:py-14">
					{/* Header */}
					<div className="flex items-center gap-4 md:gap-6 mb-8">
						<UserImage src={profile?.avatar ?? "https://avatars.githubusercontent.com/u/66080458?v=4"} alt={`${profile?.name ?? "Francesco"} avatar`} size={72} />
						<div>
							<h1 className="text-2xl md:text-3xl font-semibold tracking-wide">Dev Work</h1>
							<p className="text-sm md:text-base text-gray-300">
								A snapshot of my coding activity and projects.
							</p>
						</div>
					</div>

					{/* Summary */}
					<Card className="p-6 md:p-7 bg-black/20 border-white/10 mb-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
							<div className="flex items-center gap-3 md:gap-4">
								<motion.div className="p-2 rounded-lg bg-white/10" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
									<Github className="h-5 w-5 text-white" />
								</motion.div>
								<div>
									<p className="text-sm text-gray-400">Hi, I’m</p>
									<h2 className="text-lg md:text-xl font-semibold">{profile?.name ?? "Francesco"}</h2>
									<div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mt-1">
										<span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile?.location ?? "—"}</span>
										<a
											href={`https://github.com/${profile?.username ?? "chicco-carone"}`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors"
										>
											<Github className="h-4 w-4" /> @{profile?.username ?? "chicco-carone"}
										</a>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2 text-sm">
									<FolderGit2 className="h-4 w-4 text-gray-300" />
									<span className="text-gray-400">Public repos</span>
									<Badge variant="secondary">{profile?.publicRepos ?? 25}</Badge>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Users className="h-4 w-4 text-gray-300" />
									<span className="text-gray-400">Followers</span>
									<Badge variant="secondary">{profile?.followers ?? 7}</Badge>
								</div>
							</div>
						</div>

						<p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
							I enjoy building practical tools and experiments across TypeScript, Python, and Linux tooling.
							Recently, I’ve been working on media, automation, and remote-control projects, always focusing on
							clean UX and maintainable code.
						</p>
						{error && (
							<p className="mt-4 text-red-400 text-sm">
								Error loading profile: {error}
							</p>
						)}
					</Card>

					{/* Two-column grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<WakaTimeStats />
						<GitHubProjects repos={featuredRepos} />
					</div>

					{/* Open Source Contributions */}
					<div className="mt-8">
						<OpenSourceContributions repos={contributionRepos} />
					</div>
				</section>
			</main>
		</>
	);
}
