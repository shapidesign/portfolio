"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

export default function ContactPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  return (
    <main className="contact-page">
      {/* ── Statement headline ───────────────────────────── */}
      <section className="contact-hero section content-wrap">
        <p className="text-label" style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
          {s.contactTitle}
        </p>
        <h1 className="text-statement font-display contact-headline">
          {s.contactHero}
          <span className="contact-period" aria-hidden>.</span>
        </h1>
        <p className="lead" style={{ marginTop: "2rem", maxWidth: "50ch" }}>{s.contactLead}</p>
        <p className="contact-availability">{s.contactAvailability}</p>
        <p className="subtitle" style={{ marginTop: "0.75rem" }}>
          {s.contactSubtitle}{" "}
          <bdi>
            <a href="mailto:itsalefsofit@gmail.com" className="text-link">
              itsalefsofit@gmail.com
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
