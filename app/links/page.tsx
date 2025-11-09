"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/main/navbar";
import { Github, Linkedin, Instagram, Globe } from "lucide-react"; // Assuming Lucide React for icons

export default function Linktree() {
    const links = [
        { name: "GitHub", href: "https://github.com/tuonome", icon: Github },
        { name: "LinkedIn", href: "https://linkedin.com/in/tuonome", icon: Linkedin },
        { name: "Instagram", href: "https://instagram.com/tuonome", icon: Instagram },
        { name: "Portfolio", href: "https://tuosito.it", icon: Globe },
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
                <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.15 },
                        },
                    }}
                    className="flex flex-col items-center gap-4"
                >
                    {links.map((link, index) => (
                        <motion.li
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative text-lg tracking-wide px-6 py-2 border border-neutral-700 rounded-full transition-all duration-300 hover:border-white flex items-center gap-2"
                            >
                                {link.icon && <link.icon className="w-5 h-5 group-hover:text-white text-neutral-300" />}
                                <span className="relative z-10 group-hover:text-white text-neutral-300">
                                    {link.name}
                                </span>
                                <motion.span
                                    className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    layoutId="hover-bg"
                                />
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>
            </main>
        </>
    );
}
