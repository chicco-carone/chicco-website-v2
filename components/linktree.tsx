"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface LinkItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

interface LinktreeProps {
    links: LinkItem[];
}

export function Linktree({ links }: LinktreeProps) {
    return (
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
                    <Button
                        asChild
                        variant="outline"
                        className="group relative text-2xl tracking-wide px-16 py-6 min-w-80 border border-neutral-700 rounded-full transition-all duration-300 hover:border-white bg-transparent hover:bg-white/10 text-neutral-300 hover:text-white"
                    >
                        <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.icon && (typeof link.icon === 'string' ? (
                                <Image
                                    src={link.icon}
                                    width={24}
                                    height={24}
                                    alt={link.name}
                                    className="w-6 h-6 group-hover:brightness-0 group-hover:invert"
                                />
                            ) : (
                                <link.icon className="w-6 h-6 group-hover:text-white" />
                            ))}
                            <span className="relative z-10">
                                {link.name}
                            </span>
                            <motion.span
                                className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                layoutId="hover-bg"
                            />
                        </Link>
                    </Button>
                </motion.li>
            ))}
        </motion.ul>
    );
}
