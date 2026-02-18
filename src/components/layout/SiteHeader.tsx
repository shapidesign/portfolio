"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

        <nav id="main-nav" className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
