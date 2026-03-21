import type { Metadata } from "next";
import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About — Yehonatan Shapira, Visual & Graphic Designer",
  description: "Learn about Yehonatan Shapira (Shapi), a visual communication and graphic designer working in branding, typography, digital design, and creative direction.",
  alternates: { canonical: "https://www.shapidesign.com/about" },
  openGraph: {
    title: "About Yehonatan Shapira — Visual & Graphic Designer",
    description: "Visual communication designer who believes good design starts by understanding the problem, not the tool.",
    url: "https://www.shapidesign.com/about",
  },
};

const SKILLS = [
  "Figma",
  "Adobe CC",
  "Web Design",
  "Branding and Identity",
  "Copywriting",
  "Typography",
];

export default function AboutPage() {
  return (
    <main className="section content-wrap about-page">
      <Reveal className="about-intro">
        <h1>About</h1>
        <p className="lead">
          Good design starts with the right question, not the right aesthetic.
        </p>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>What I Believe In?</h2>
          <p>
            Design is never <em>my</em> style. It&apos;s <em>your</em> problem and <em>our</em> solution.
          </p>
        </section>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>Why I Do?</h2>
          <p>
            Great design starts with asking the right questions. I love the process of untangling complex information and finding the core human need behind it.
          </p>
        </section>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>How I Do?</h2>
          <p>
            Every project demands different tools. I learn what the work needs, not what my portfolio already has.
          </p>
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
            Download CV
          </CtaButton>
          <CtaButton href="/contact" variant="ghost">
            Contact me
          </CtaButton>
        </div>
      </Reveal>
    </main>
  );
}
