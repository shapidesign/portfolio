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

  if (download || href.startsWith("#")) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        href={href}
        onClick={onClick}
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
