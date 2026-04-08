"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

type RouteTransitionProps = Readonly<{
  children: React.ReactNode;
}>;


export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (reducedMotion) {
    return <div className="route-shell">{children}</div>;
  }

  return (
    <div className="route-shell">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="route-content"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.28,
            ease: [0.2, 0.7, 0.2, 1]
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
