"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/main/navbar";
import { UserImage } from "@/components/user-image";

export default function Home() {
  const [spin, setSpin] = useState(false);
  const lastKeyRef = useRef<string | null>(null);
  const lastPressTimeRef = useRef<number>(0);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key !== "x" && key !== "z") return;

      const now = Date.now();
      const timeSinceLast = now - lastPressTimeRef.current;

      if (
        lastKeyRef.current &&
        lastKeyRef.current !== key &&
        timeSinceLast <= 150
      ) {
        setSpin(true);
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = setTimeout(() => setSpin(false), 150);
      } else if (!lastKeyRef.current || timeSinceLast > 150) {
        setSpin(false);
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      }

      lastKeyRef.current = key;
      lastPressTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
        {/* Immagine sopra la linea */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2"
        >
          <motion.div
            animate={spin ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <UserImage
              src="/profile-image.jpg"
              alt="Profile Image"
              size={150}
              spin={spin}
            />
          </motion.div>
        </motion.div>

        {/* Linea centrale orizzontale */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.45, 0, 0.55, 1] }}
          className="h-px w-24 bg-neutral-700 mb-2"
        />

        {/* Nome sotto la linea */}
        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-semibold tracking-wide"
        >
          Chicco
        </motion.h1>
      </main>
    </>
  );
}
