"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

export function SiteFooter() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  return (
    <footer className="site-footer">
      <div className="content-wrap footer-row">
        <p className="footer-copy">{s.footerCopy}</p>
        <div className="footer-links">
          <Link href="/work">{s.navWork}</Link>
          <Link href="/shirts">{s.navShirts}</Link>
          <Link href="/about">{s.navAbout}</Link>
          <Link href="/contact">{s.navContact}</Link>
          <a
            href="https://www.linkedin.com/in/yehonatan-shapira"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
