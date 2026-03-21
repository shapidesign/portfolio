"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useProjectTitle } from "@/context/ProjectContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

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
  const { title: projectTitle } = useProjectTitle();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    let rafId = 0;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      bar.style.width = `${progress * 100}%`;
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <header className="site-header">
      <div className="scroll-progress" ref={progressRef} />
      <div className="content-wrap nav-row">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <svg className="brand-star" width="20" height="20" viewBox="0 0 45 43" fill="none" aria-hidden>
              <path d={STAR_PATH} fill="var(--color-primary)" />
            </svg>
            Yehonatan Shapira
          </Link>

          <AnimatePresence>
            {projectTitle && (
              <motion.span
                key="project-title"
                className="header-project-title"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              >
                / {projectTitle}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="nav-actions">
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

          <ThemeToggle />

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
        </div>
      </div>
    </header>
  );
}
