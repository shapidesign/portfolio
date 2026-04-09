"use client";

import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/ui/WordReveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

export default function AboutPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  return (
    <main className="about-page">
      {/* ── Split hero ───────────────────────────────────── */}
      <section className="about-hero section content-wrap">
        <p className="text-label" style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
          {s.heroName}
        </p>
        <h1 className="text-display font-display">
          <WordReveal text={typeof s.aboutTitle === "string" ? s.aboutTitle : "About"} delay={100} stagger={60} />
        </h1>
        <p className="lead" style={{ marginTop: "2rem", maxWidth: "60ch" }}>{s.aboutLead}</p>
      </section>

      {/* ── Belief blocks ────────────────────────────────── */}
      <section className="about-blocks section content-wrap">
        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {s.aboutWhoHeading}
            </h2>
            <p className="lead">{s.aboutWhoBody}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {s.aboutHowHeading}
            </h2>
            <p className="lead">{s.aboutHowBody}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {s.aboutNowHeading}
            </h2>
            <p className="lead">{s.aboutNowBody}</p>
          </div>
        </Reveal>
      </section>

      {/* ── Actions ─────────────────────────────────────── */}
      <Reveal>
        <div className="about-actions section content-wrap">
          <div className="detail-actions">
            <CtaButton href="/assets/YehonatanShapira-CV2026.pdf" download>
              {s.downloadCV}
            </CtaButton>
            <CtaButton href="/contact" variant="ghost">
              {s.contactMe}
            </CtaButton>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
