"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useProjectTitle } from "@/context/ProjectContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { projects } from "@/data/projects";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

type NavItemKey = "navHome" | "navAbout" | "navContact";

const navItemDefs: { href: string; key: NavItemKey }[] = [
  { href: "/", key: "navHome" },
  { href: "/about", key: "navAbout" },
  { href: "/contact", key: "navContact" },
];

type BrandSpinState = "idle" | "active" | "settling";

function supportsPreciseHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 740px)").matches
  );
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [brandSpinState, setBrandSpinState] = useState<BrandSpinState>("idle");
  const reducedMotion = usePrefersReducedMotion();
  const { title: projectTitle } = useProjectTitle();
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);
  const navItems = navItemDefs.map((d) => ({ href: d.href, label: s[d.key] }));
  const progressRef = useRef<HTMLDivElement>(null);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const activeSpinTimeoutRef = useRef<number | null>(null);
  const settleSpinTimeoutRef = useRef<number | null>(null);
  const visitedSectionsRef = useRef<Set<Element>>(new Set());

  const isWorkActive = pathname === "/work" || pathname?.startsWith("/work/");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 740px)");
    const updateMobileState = (event?: MediaQueryListEvent) => {
      setIsMobileNav(event ? event.matches : mediaQuery.matches);
    };

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

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

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setOpen(false);
      setWorkMenuOpen(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  useEffect(() => {
    if (!workMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (workMenuRef.current && !workMenuRef.current.contains(event.target as Node)) {
        setWorkMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setWorkMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [workMenuOpen]);

  useEffect(() => {
    if (brandSpinState !== "active" || reducedMotion || supportsPreciseHover()) return;

    visitedSectionsRef.current.clear();

    const settleSpin = () => {
      setBrandSpinState((current) => (current === "active" ? "settling" : current));
    };

    activeSpinTimeoutRef.current = window.setTimeout(settleSpin, 4500);

    const sectionTargets = Array.from(
      new Set(Array.from(document.querySelectorAll("main .section, main section")))
    );

    if (sectionTargets.length === 0) {
      return () => {
        if (activeSpinTimeoutRef.current !== null) {
          window.clearTimeout(activeSpinTimeoutRef.current);
          activeSpinTimeoutRef.current = null;
        }
      };
    }

    const targetCount = Math.min(3, sectionTargets.length);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            visitedSectionsRef.current.add(entry.target);
          }
        }

        if (visitedSectionsRef.current.size >= targetCount) {
          settleSpin();
        }
      },
      {
        threshold: [0.55],
        rootMargin: "-76px 0px -12% 0px"
      }
    );

    sectionTargets.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      if (activeSpinTimeoutRef.current !== null) {
        window.clearTimeout(activeSpinTimeoutRef.current);
        activeSpinTimeoutRef.current = null;
      }
    };
  }, [brandSpinState, reducedMotion]);

  useEffect(() => {
    if (brandSpinState !== "settling") return;

    settleSpinTimeoutRef.current = window.setTimeout(() => {
      setBrandSpinState("idle");
    }, 1100);

    return () => {
      if (settleSpinTimeoutRef.current !== null) {
        window.clearTimeout(settleSpinTimeoutRef.current);
        settleSpinTimeoutRef.current = null;
      }
    };
  }, [brandSpinState]);

  function closeMenus() {
    setOpen(false);
    setWorkMenuOpen(false);
  }

  function handleBrandClick() {
    closeMenus();

    if (reducedMotion || supportsPreciseHover()) return;

    if (activeSpinTimeoutRef.current !== null) {
      window.clearTimeout(activeSpinTimeoutRef.current);
      activeSpinTimeoutRef.current = null;
    }

    if (settleSpinTimeoutRef.current !== null) {
      window.clearTimeout(settleSpinTimeoutRef.current);
      settleSpinTimeoutRef.current = null;
    }

    setBrandSpinState("active");
  }

  function renderNavLink(item: (typeof navItems)[number]) {
    const isActive =
      pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`nav-link ${isActive ? "active" : ""}`}
        onClick={closeMenus}
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
  }

  return (
    <header className="site-header">
      <div className="scroll-progress" ref={progressRef} />
      <div className="content-wrap nav-row">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <Link
            href="/"
            className="brand"
            onClick={handleBrandClick}
            data-spin-state={brandSpinState}
          >
            <svg className="brand-star" width="20" height="20" viewBox="0 0 45 43" fill="none" aria-hidden>
              <path d={STAR_PATH} fill="var(--color-primary)" />
            </svg>
            {s.brandName}
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
              {renderNavLink(navItems[0])}

              {isMobileNav ? (
                <Link
                  href="/work"
                  prefetch={false}
                  className={`nav-link work-nav-mobile ${isWorkActive ? "active" : ""}`}
                  onClick={closeMenus}
                >
                  {isWorkActive && !reducedMotion && (
                    <motion.span
                      className="nav-active-bg"
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {s.navWork}
                </Link>
              ) : (
                <div
                  ref={workMenuRef}
                  className={`work-nav-item ${workMenuOpen ? "open" : ""}`}
                  onMouseEnter={() => {
                    if (supportsPreciseHover()) setWorkMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (supportsPreciseHover()) setWorkMenuOpen(false);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link work-nav-trigger ${isWorkActive ? "active" : ""}`}
                    aria-expanded={workMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setWorkMenuOpen((prev) => !prev)}
                  >
                    {isWorkActive && !reducedMotion && (
                      <motion.span
                        className="nav-active-bg"
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {s.navWork}
                    <span className="work-nav-chevron" aria-hidden>
                      ▾
                    </span>
                  </button>

                  <div className="work-dropdown" aria-label="Project navigation">
                    <Link
                      href="/work"
                      prefetch={false}
                      className="work-dropdown-all"
                      onClick={closeMenus}
                    >
                      <span>{s.seeAllProjects}</span>
                      <span aria-hidden>{s.arrowForward}</span>
                    </Link>

                    <div className="work-dropdown-list">
                      {projects.map((project) => {
                        const thumbnailSrc = project.images[0];

                        return (
                          <Link
                            key={project.slug}
                            href={`/work/${project.slug}`}
                            className="work-dropdown-link"
                            onClick={closeMenus}
                          >
                            <span className="work-dropdown-copy">
                              <span className="work-dropdown-title">{(isHebrew && project.heTitle) || project.title}</span>
                              <span className="work-dropdown-meta">{project.year}</span>
                            </span>

                            <span
                              className={`work-dropdown-thumb ${thumbnailSrc ? "has-image" : "is-empty"}`}
                              aria-hidden="true"
                            >
                              {thumbnailSrc ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={thumbnailSrc} alt="" loading="lazy" decoding="async" />
                                </>
                              ) : (
                                <span className="work-dropdown-thumb-fallback">
                                  {project.title
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((word) => word[0])
                                    .join("")}
                                </span>
                              )}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {navItems.slice(1).map(renderNavLink)}
            </nav>
          </LayoutGroup>

          <LanguageToggle />

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
