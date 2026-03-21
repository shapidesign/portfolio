"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useProjectTitle } from "@/context/ProjectContext";

type Props = {
  title: string;
  children: ReactNode;
};

export function ProjectHeaderObserver({ title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { setTitle } = useProjectTitle();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTitle(entry.isIntersecting ? null : title);
      },
      { threshold: 0, rootMargin: "-76px 0px 0px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      setTitle(null);
    };
  }, [title, setTitle]);

  return <div ref={ref}>{children}</div>;
}
