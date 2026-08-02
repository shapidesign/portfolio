"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProjectTitle } from "@/context/ProjectContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/i18n/strings";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const STAR_PATH =
  "M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z";

type NavItemKey = "navWork" | "navAbout" | "navContact";

const navItemDefs: { href: string; key: NavItemKey }[] = [
  { href: "/work", key: "navWork" },
  { href: "/about", key: "navAbout" },
  { href: "/contact", key: "navContact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { title: projectTitle } = useProjectTitle();
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const { count, openCart } = useCart();
  const navItems = navItemDefs.map((d) => ({ href: d.href, label: s[d.key] }));
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      bar.style.width = `${progress * 100}%`;
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setOpen(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  function closeMenus() {
    setOpen(false);
  }

  // The solar homepage hides the header via CSS; skip rendering entirely so we
  // don't pay for the scroll-progress listener or hidden DOM on "/".
  if (pathname === "/") return null;

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
            onClick={closeMenus}
          >
            <svg className="brand-star" width="20" height="20" viewBox="0 0 45 43" fill="none" aria-hidden>
              <path d={STAR_PATH} fill="var(--color-primary)" />
            </svg>
            {s.brandName}
          </Link>
          {projectTitle && <span className="header-project-title">/ {projectTitle}</span>}
        </div>

        <div className="nav-actions">
          <nav id="main-nav" className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">
            {navItems.map(renderNavLink)}
          </nav>

          <LanguageToggle />

          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`${s.shopCart}${count > 0 ? ` (${count})` : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 8h12l-1 12H7L6 8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V6.5a3 3 0 0 1 6 0V8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {count > 0 ? <span className="cart-button-badge">{count}</span> : null}
          </button>

          <button
            className={`menu-button ${open ? "open" : ""}`}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
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
