import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

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
          I design with passion and curiosity, through research and learning, to find solutions to your problems.
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
