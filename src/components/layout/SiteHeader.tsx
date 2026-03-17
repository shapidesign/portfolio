"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as motion from "motion/react-client";
import { LayoutGroup } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <header className="site-header">
      <div className="content-wrap nav-row">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          Yehonatan Shapira
        </Link>

        <button
          className={`menu-button ${open ? "open" : ""}`}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="menu-label">Menu</span>
          <span className="menu-icon" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>

        <LayoutGroup>
          <nav id="main-nav" className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href === "/work" ? false : undefined}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {isActive && !reducedMotion && (
                    <motion.span
                      className="nav-active-bg"
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>
    </header>
  );
}
