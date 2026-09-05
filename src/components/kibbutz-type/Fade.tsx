"use client";

import { motion, useReducedMotion } from "motion/react";

type FadeProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}>;

/** Short opacity + translate reveal on scroll; instant when reduced motion is preferred. */
export function Fade({ children, className, delay = 0 }: FadeProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
