import { useEffect, useState } from "react";

function isLikelyRoundDisplay() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // 1) Check if viewport is nearly square
  const aspectClose = Math.abs(w - h) / Math.max(w, h) < 0.06;

  // 2) Small bonus for PWA standalone mode (common on watches)
  const cornerRadiusHint =
    window.matchMedia("(display-mode: standalone)").matches ? 0.5 : 0;

  // 3) UA hints for Wear OS devices
  const ua = navigator.userAgent.toLowerCase();
  const uaWear =
    ua.includes("wear os") ||
    ua.includes("sm-r") || // Samsung Galaxy Watch
    ua.includes("watch") ||
    ua.includes("androidwear");

  // 4) Small screen heuristic (watches are typically < 500px in both dimensions)
  const isSmallScreen = w < 500 && h < 500;

  // Heuristic: consider round if quasi-square + (wear UA or display-mode standalone or small screen)
  return aspectClose && (uaWear || cornerRadiusHint > 0 || isSmallScreen);
}

export function useRoundScreenFlag() {
  const [round, setRound] = useState(false);

  useEffect(() => {
    const update = () => setRound(isLikelyRoundDisplay());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const cls = "is-round-screen";
    if (round) document.documentElement.classList.add(cls);
    else document.documentElement.classList.remove(cls);
  }, [round]);

  return round;
}
