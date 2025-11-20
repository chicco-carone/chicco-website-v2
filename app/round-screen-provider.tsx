"use client";

import { useRoundScreenFlag } from "@/hooks/use-round-screen-flag";
import { useEggToggle } from "@/hooks/use-egg-toggle";

export function RoundScreenProvider() {
  useRoundScreenFlag();
  useEggToggle();

  return null; // This component only sets up the hooks, no UI
}
