"use client";

import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/ui/WordReveal";
import { useLanguage } from "@/context/LanguageContext";
import { siteCopyText, type SiteCopy } from "@/lib/site-copy";

export function AboutView({ siteCopy }: { siteCopy: SiteCopy }) {
  const { isHebrew } = useLanguage();
  const text = (en: string, he: string) => siteCopyText(siteCopy, isHebrew, en, he);

  return (
    <main className="about-page">
      <section className="about-hero section content-wrap">
        <p className="text-label" style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
          {text("aboutName", "heAboutName")}
        </p>
        <h1 className="text-display font-display">
          <WordReveal text={text("aboutTitle", "heAboutTitle")} delay={100} stagger={60} />
        </h1>
        <p className="lead" style={{ marginTop: "2rem", maxWidth: "60ch" }}>
          {text("aboutLead", "heAboutLead")}
        </p>
      </section>

      <section className="about-blocks section content-wrap">
        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {text("aboutWhoHeading", "heAboutWhoHeading")}
            </h2>
            <p className="lead">{text("aboutWhoBody", "heAboutWhoBody")}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {text("aboutHowHeading", "heAboutHowHeading")}
            </h2>
            <p className="lead">{text("aboutHowBody", "heAboutHowBody")}</p>
          </div>
        </Reveal>

        <Reveal className="about-block">
          <div className="detail-block">
            <h2 className="text-display font-display" style={{ marginBottom: "1.5rem" }}>
              {text("aboutNowHeading", "heAboutNowHeading")}
            </h2>
            <p className="lead">{text("aboutNowBody", "heAboutNowBody")}</p>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <div className="about-actions section content-wrap">
          <div className="detail-actions">
            <CtaButton href="/assets/YehonatanShapira-CV2026.pdf" download>
              {text("aboutDownloadCV", "heAboutDownloadCV")}
            </CtaButton>
            <CtaButton href="/contact" variant="ghost">
              {text("aboutContactMe", "heAboutContactMe")}
            </CtaButton>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
