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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reducedMotion) {
    return <div className="route-shell">{children}</div>;
  }

  return (
    <div className="route-shell">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          className="route-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
