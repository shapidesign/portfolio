import { ProjectRow } from "@/components/ui/ProjectRow";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

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
