"use client";

import { Navbar } from "@/components/main/navbar";
import { Linktree } from "@/components/linktree";
import { FaGithub, FaReddit, FaTelegram, FaSteam } from "react-icons/fa"; // Using react-icons

export default function LinksPage() {
    const links = [
        { name: "GitHub", href: "https://github.com/chicco-carone", icon: FaGithub },
        { name: "Reddit", href: "https://www.reddit.com/user/Chiccocarone", icon: FaReddit },
        { name: "Telegram", href: "https://t.me/Chicco2008", icon: FaTelegram },
        { name: "Steam", href: "https://steamcommunity.com/id/Chicco8/", icon: FaSteam },
        { name: "Osu", href: "https://osu.ppy.sh/users/26161155", icon: "/osu.svg" },
    ];

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
                {/* Linea centrale orizzontale */}
                <div className="h-px w-24 bg-neutral-700 mb-8" />

                {/* Titolo */}
                <h1 className="text-3xl font-semibold tracking-wide mb-6">
                    Linktree
                </h1>

                {/* Link List */}
                <Linktree links={links} />
            </main>
        </>
    );
}
