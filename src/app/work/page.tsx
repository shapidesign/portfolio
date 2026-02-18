import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

export default function WorkPage() {
  const projectCount = projects.length;

  return (
    <main className="section content-wrap">
      <Reveal>
        <div className="section-head">
          <h1>Work</h1>
          <p className="subtitle">{projectCount} projects curated from my Notion workspace.</p>
        </div>
      </Reveal>

      <div className="project-grid">
        {projects.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
