import type { Metadata } from "next";
import { ProjectRow } from "@/components/ui/ProjectRow";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work — Design Projects by Yehonatan Shapira",
  description: "Selected design projects by Yehonatan Shapira (Shapi Design) in branding, typography, digital design, and visual communication.",
  alternates: { canonical: "https://www.shapidesign.com/work" },
  openGraph: {
    title: "Work — Design Projects by Yehonatan Shapira",
    description: "Branding, typography, digital design, and visual communication projects by Yehonatan Shapira.",
    url: "https://www.shapidesign.com/work",
  },
};

export default function WorkPage() {
  const projectCount = projects.length;

  return (
    <main className="section content-wrap">
      <Reveal>
        <div className="section-head">
          <h1>Work</h1>
          <p className="subtitle">{projectCount} selected works showcasing design & development.</p>
        </div>
      </Reveal>

      {projectCount > 0 ? (
        <div className="project-list">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 60}>
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <p className="subtitle">Project data is currently unavailable. Please refresh shortly.</p>
        </Reveal>
      )}
    </main>
  );
}
