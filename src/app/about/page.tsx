"use client";

import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/ui/WordReveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

const SKILLS_EN = [
  "Figma",
  "Adobe CC",
  "Web Design",
  "Branding and Identity",
  "Copywriting",
  "Typography",
];

const SKILLS_HE = [
  "Figma",
  "Adobe CC",
  "עיצוב אתרים",
  "מיתוג וזהות",
  "קופירייטינג",
  "טיפוגרפיה",
];

export default function AboutPage() {
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);
  const skills = isHebrew ? SKILLS_HE : SKILLS_EN;

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
              {s.aboutBelieveTitle}
            </h2>
            <p className="lead">{s.aboutBelieveBody}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {s.aboutWhyTitle}
            </h2>
            <p className="lead">{s.aboutWhyBody}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {s.aboutHowTitle}
            </h2>
            <p className="lead">{s.aboutHowBody}</p>
            <div className="about-skills" style={{ marginTop: "2rem" }}>
              {skills.map((skill) => (
                <span key={skill} className="project-tag">
                  {skill}
                </span>
              ))}
            </div>
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
