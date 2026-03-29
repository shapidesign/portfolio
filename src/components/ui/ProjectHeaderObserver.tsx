"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useProjectTitle } from "@/context/ProjectContext";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  title: string;
  heTitle?: string;
  children: ReactNode;
};

export function ProjectHeaderObserver({ title, heTitle, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { setTitle } = useProjectTitle();
  const { isHebrew } = useLanguage();

  const displayTitle = (isHebrew && heTitle) || title;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTitle(entry.isIntersecting ? null : displayTitle);
      },
      { threshold: 0, rootMargin: "-76px 0px 0px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      setTitle(null);
    };
  }, [displayTitle, setTitle]);

  return <div ref={ref}>{children}</div>;
}
