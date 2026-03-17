import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
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

  const title = `${project.title} | Yehonatan Shapira`;
  const description = (project.description || project.summary || "")
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 160);
  const url = `https://www.shapidesign.com/work/${slug}`;
  const images =
    project.images.length > 0
      ? [{ url: project.images[0], width: 1200, height: 630, alt: project.title }]
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images,
      siteName: "Yehonatan Shapira Portfolio"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url)
    },
    alternates: {
      canonical: url
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const isDigitalHandprint = slug === "digital-handprint";
  const isDavidka = slug === "small-world-problems";
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const previousProject =
    projects.length > 1 ? projects[(projectIndex - 1 + projects.length) % projects.length] : null;
  const nextProject = projects.length > 1 ? projects[(projectIndex + 1) % projects.length] : null;

  const mediaNode = isDigitalHandprint ? (
    <DigitalHandprintEmbed />
  ) : isDavidka ? (
    <DavidkaProjectEmbed />
  ) : project.images.length > 0 ? (
    <div className="project-image-stack">
      {project.images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={`${project.title} - Image ${index + 1}`}
          className="project-stack-image"
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  ) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": (project.description || project.summary || "").replace(/<[^>]*>?/gm, ""),
    "image": project.images[0] || "",
    "url": `https://www.shapidesign.com/work/${project.slug}`,
    "author": {
      "@type": "Person",
      "name": "Yehonatan Shapira"
    },
    "datePublished": project.year
  };

  return (
    <main className="section content-wrap project-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Reveal>
        <p className="eyebrow">{project.subHeader || project.category}</p>
        <h1>{project.title}</h1>
        {project.context && (
          <p className="project-context-detail">{project.context}</p>
        )}
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

      {mediaNode && (
        <Reveal>
          <section className="project-media-shell">
            <div className="project-media-content">{mediaNode}</div>
          </section>
        </Reveal>
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

      {(previousProject || nextProject) && (
        <Reveal>
          <nav className="project-nav-text" aria-label="Project navigation">
            {previousProject ? (
              <Link href={`/work/${previousProject.slug}`} className="project-nav-text-link project-nav-text-prev">
                <span className="project-nav-text-arrow" aria-hidden>←</span>
                <span>
                  <span className="project-nav-text-label">Previous project</span>
                  <span className="project-nav-text-title">{previousProject.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link href={`/work/${nextProject.slug}`} className="project-nav-text-link project-nav-text-next">
                <span>
                  <span className="project-nav-text-label">Next project</span>
                  <span className="project-nav-text-title">{nextProject.title}</span>
                </span>
                <span className="project-nav-text-arrow" aria-hidden>→</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
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
