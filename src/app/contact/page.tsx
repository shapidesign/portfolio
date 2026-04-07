"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

export default function ContactPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const [periodHover, setPeriodHover] = useState(false);

  return (
    <main className="contact-page">
      {/* ── Statement headline ───────────────────────────── */}
      <section className="contact-hero section content-wrap">
        <p className="text-label" style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
          {s.contactTitle}
        </p>
        <h1 className="text-statement font-display contact-headline">
          {s.contactHero}
          <span
            className="contact-period"
            style={{
              color: periodHover ? "var(--color-primary)" : "var(--color-text)",
              transition: "color 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "inline-block",
            }}
            onMouseEnter={() => setPeriodHover(true)}
            onMouseLeave={() => setPeriodHover(false)}
            aria-hidden
          >
            .
          </span>
        </h1>
        <p className="lead" style={{ marginTop: "2rem", maxWidth: "50ch" }}>{s.contactLead}</p>
        <p className="subtitle" style={{ marginTop: "0.75rem" }}>
          {s.contactSubtitle}{" "}
          <bdi>
            <a href="mailto:shapidesigns@gmail.com" className="text-link">
              shapidesigns@gmail.com
            </a>
          </bdi>
          <br />
          <bdi>
            <a
              href="/assets/YehonatanShapira-CV2026.pdf"
              download
              className="text-link"
            >
              {s.contactDownloadCV}
            </a>
          </bdi>
        </p>
      </section>

      {/* ── Form ─────────────────────────────────────────── */}
      <section className="section content-wrap contact-form-section">
        <Reveal>
          <ContactForm />
        </Reveal>
      </section>
    </main>
  );
}
