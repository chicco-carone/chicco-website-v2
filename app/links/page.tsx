"use client";

import { motion } from "framer-motion";
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
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: [0.45, 0, 0.55, 1] }}
                    className="h-px w-24 bg-neutral-700 mb-8"
                />

                {/* Titolo */}
                <motion.h1
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl font-semibold tracking-wide mb-6"
                >
                    Linktree
                </motion.h1>

                {/* Link List */}
                <Linktree links={links} />
            </main>
        </>
    );
}
