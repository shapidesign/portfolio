"use client";

import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

const SKILLS = [
  "Figma",
  "Adobe CC",
  "Web Design",
  "Branding and Identity",
  "Copywriting",
  "Typography",
];

export default function AboutPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  return (
    <main className="section content-wrap about-page">
      <Reveal className="about-intro">
        <h1>{s.aboutTitle}</h1>
        <p className="lead">{s.aboutLead}</p>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>{s.aboutBelieveTitle}</h2>
          <p>{s.aboutBelieveBody}</p>
        </section>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>{s.aboutWhyTitle}</h2>
          <p>{s.aboutWhyBody}</p>
        </section>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>{s.aboutHowTitle}</h2>
          <p>{s.aboutHowBody}</p>
          <div className="about-skills">
            {SKILLS.map((skill) => (
              <span key={skill} className="project-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal className="about-actions">
        <div className="detail-actions">
          <CtaButton href="/assets/YehonatanShapira-CV-Sep2025.pdf" download>
            {s.downloadCV}
          </CtaButton>
          <CtaButton href="/contact" variant="ghost">
            {s.contactMe}
          </CtaButton>
        </div>
      </Reveal>
    </main>
  );
}
