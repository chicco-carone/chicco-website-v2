"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home,
  Info,
  Link as LinkIcon,
  List,
  Sparkles,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";

export function Navbar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About Me", icon: Info },
    { href: "/dev-work", label: "Dev Work", icon: BadgeCheck },
    { href: "/links", label: "Links", icon: LinkIcon },
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Nav */}
          <NavigationMenu
            viewport={isMobile}
            aria-label="Primary"
            className="max-w-none"
          >
            <NavigationMenuList className="flex-wrap gap-1 md:gap-2">
              {items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <NavigationMenuItem key={href}>
                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="overflow-hidden"
                    >
                      <NavigationMenuLink
                        onClick={() => router.push(href)}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "group inline-flex items-center gap-2 rounded-lg min-h-[2.5rem] p-[10px]",
                          "px-4 py-2.5 md:px-5 md:py-3 text-sm font-medium",
                          "transition-[background,color,box-shadow] duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-transparent text-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                          aria-hidden
                        />
                        <span className="whitespace-nowrap">{label}</span>
                      </NavigationMenuLink>
                    </motion.div>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="relative mt-1 h-0.5 w-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </header>
  );
}
