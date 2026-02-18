"use client";

import Link from "next/link";
import { useAnimeButton } from "@/hooks/useAnimeButton";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  download?: boolean;
  children: React.ReactNode;
};

export function CtaButton({ href, variant = "primary", download, children }: CtaButtonProps) {
  const ref = useAnimeButton();

  const className = `button button-${variant}`;

  if (download) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        href={href}
        download
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
    >
      {children}
    </Link>
  );
}
