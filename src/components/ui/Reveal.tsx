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
        { threshold: 0.01 }
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
        transition: `opacity 700ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }
    : { opacity: 0, transform: "translateY(64px)" };

  return (
    <div ref={ref} className={className ?? ""} style={style}>
      {children}
    </div>
  );
}
