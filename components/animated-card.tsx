"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function AnimatedCard({ children, index, className }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
