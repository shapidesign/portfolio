import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Yehonatan Shapira`,
    description: project.description || project.summary
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="section content-wrap project-detail">
      <Reveal>
        <p className="eyebrow">{project.subHeader || project.category}</p>
        <h1>{project.title}</h1>
        <p className="lead">{project.description || project.summary}</p>
      </Reveal>

      <Reveal>
        <div className="meta-row">
          {project.tags.length > 0 && (
            <p>
              <strong>Tags</strong> {project.tags.join(" • ")}
            </p>
          )}
          {project.year && (
            <p>
              <strong>Year</strong> {project.year}
            </p>
          )}
        </div>
      </Reveal>

      <Reveal>
        <section className="detail-block">
          <h2>Overview</h2>
          <p>{project.bodyText}</p>
        </section>
      </Reveal>

      {project.challenge && (
        <Reveal>
          <section className="detail-block">
            <h2>The Challenge</h2>
            <p>{project.challenge}</p>
          </section>
        </Reveal>
      )}

      {project.process && (
        <Reveal>
          <section className="detail-block">
            <h2>The Process</h2>
            <p>{project.process}</p>
          </section>
        </Reveal>
      )}

      {project.outcome && (
        <Reveal>
          <section className="detail-block">
            <h2>The Outcome</h2>
            <p>{project.outcome}</p>
          </section>
        </Reveal>
      )}

      {project.images.length > 0 && (
        <Reveal>
          <section className="detail-block">
            <h2>Images</h2>
            <div className="project-image-list">
              {project.images.map((imageUrl) => (
                <a
                  key={imageUrl}
                  href={imageUrl}
                  className="text-link"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {imageUrl}
                </a>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {project.url && (
        <Reveal>
          <section className="detail-block">
            <h2>Project URL</h2>
            <a href={project.url} className="text-link" target="_blank" rel="noreferrer noopener">
              Visit external project
            </a>
          </section>
        </Reveal>
      )}

      <Reveal>
        <div className="detail-actions">
          <Link href="/work" className="button button-ghost">
            Back to work
          </Link>
          <Link href="/contact" className="button button-primary">
            Start a project
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
