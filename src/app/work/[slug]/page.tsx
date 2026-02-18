import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { getProjectBySlug, projects } from "@/data/projects";
import { DigitalHandprintEmbed } from "./DigitalHandprintEmbed";
import { DavidkaProjectEmbed } from "./DavidkaProjectEmbed";

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

  const isDigitalHandprint = slug === "digital-handprint";
  const isDavidka = slug === "small-world-problems";

  return (
    <main className="section content-wrap project-detail">
      <Reveal>
        <p className="eyebrow">{project.subHeader || project.category}</p>
        <h1>{project.title}</h1>
      </Reveal>

      <Reveal>
        <div className="meta-row">
          {project.tags.length > 0 &&
            project.tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          {project.year && <span className="meta-year">{project.year}</span>}
        </div>
      </Reveal>

      {project.url && (
        <Reveal>
          <a href={project.url} className="button button-ghost" target="_blank" rel="noreferrer noopener">
            Visit project
          </a>
        </Reveal>
      )}

      {isDigitalHandprint ? (
        <Reveal>
          <DigitalHandprintEmbed />
        </Reveal>
      ) : isDavidka ? (
        <Reveal>
          <DavidkaProjectEmbed />
        </Reveal>
      ) : (
        project.images.length > 0 && (
          <Reveal>
            <ImageCarousel images={project.images} alt={project.title} />
          </Reveal>
        )
      )}

      <Reveal>
        <section className="detail-block">
          <div
            className="preserve-breaks"
            dangerouslySetInnerHTML={{
              __html: (project.description || project.bodyText)
                .replace(/<(?!\/?(?:strong|em|br\s*\/?)>)/gi, "&lt;")
            }}
          />
        </section>
      </Reveal>

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
