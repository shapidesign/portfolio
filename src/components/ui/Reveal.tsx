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
    ? { opacity: 1, transform: "translateY(0) scale(1)", transition: `opacity 500ms ${delay}ms cubic-bezier(0.2,0.7,0.2,1), transform 500ms ${delay}ms cubic-bezier(0.2,0.7,0.2,1)` }
    : { opacity: 0, transform: "translateY(22px) scale(0.985)" };

  return (
    <div ref={ref} className={className ?? ""} style={style}>
      {children}
    </div>
  );
}
