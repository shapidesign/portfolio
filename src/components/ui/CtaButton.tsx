"use client";

import Link from "next/link";
import { useAnimeButton } from "@/hooks/useAnimeButton";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  download?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
};

export function CtaButton({ href, variant = "primary", download, onClick, children }: CtaButtonProps) {
  const ref = useAnimeButton();

  const className = `button button-${variant}`;

  const handleSamePageAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || download) return;
    if (!href.startsWith("#") || href.length <= 1) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
    window.history.replaceState(null, "", href);
  };

  if (download || href.startsWith("#")) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        href={href}
        onClick={href.startsWith("#") && !download ? handleSamePageAnchorClick : onClick}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      prefetch={href === "/work" ? false : undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
