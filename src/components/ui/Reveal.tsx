"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}>;

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    let done = false;
    const doReveal = () => {
      if (done) return;
      done = true;
      setShow(true);
    };

    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            io.disconnect();
            doReveal();
          }
        },
        { threshold: 0.08 }
      );
      io.observe(el);

      const timer = setTimeout(doReveal, 800);
      return () => {
        io.disconnect();
        clearTimeout(timer);
      };
    }

    doReveal();
  }, [show]);

  const style: React.CSSProperties = show
    ? {
        opacity: 1,
        transform: "translateY(0)",
        transition: `opacity 580ms ${delay}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 580ms ${delay}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        overflowAnchor: "none",
      }
    : { opacity: 0, transform: "translateY(22px)", overflowAnchor: "none" };

  return (
    <div ref={ref} className={className ?? ""} style={style}>
      {children}
    </div>
  );
}
