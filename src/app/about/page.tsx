import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

export default function AboutPage() {
  return (
    <main className="section content-wrap about-page">
      <Reveal className="about-intro">
        <h1>About</h1>
        <p className="lead">
          I am Yehonatan Shapira, a visual creator shaping brand and digital experiences through simple,
          geometric, and thoughtful design systems.
        </p>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>What I focus on</h2>
          <p>
            My work combines logo design, packaging, identity systems, web design, and experimental
            typography. I care about visual clarity, emotional depth, and practical implementation.
          </p>
        </section>
      </Reveal>

      <Reveal className="about-block">
        <section className="detail-block">
          <h2>How I work</h2>
          <p>
            Every project begins with context and intent. From there, I develop clear visual structures,
            test ideas quickly, and refine details that make the final result both memorable and usable.
          </p>
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
