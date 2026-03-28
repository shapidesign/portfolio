import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectHeaderObserver } from "@/components/ui/ProjectHeaderObserver";
import { ProjectNavBar } from "@/components/ui/ProjectNavBar";
import { ProjectDetailContent, ProjectBodyBlock } from "@/components/ui/ProjectDetailContent";
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

  const title = `${project.title} — Design by Yehonatan Shapira`;
  const description = (project.description || project.summary || "")
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 160);
  const url = `https://www.shapidesign.com/work/${slug}`;
  const images =
    project.images.length > 0
      ? [{ url: project.images[0], width: 1200, height: 630, alt: `${project.title} — project by Yehonatan Shapira` }]
      : [];

  return {
    title,
    description,
    keywords: [...project.tags, "Yehonatan Shapira", "Shapi Design", "design project"],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images,
      siteName: "Shapi Design — Yehonatan Shapira"
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
  const mediaNode = isDigitalHandprint ? (
    <DigitalHandprintEmbed />
  ) : isDavidka ? (
    <DavidkaProjectEmbed />
  ) : project.images.length > 0 ? (
    <div className="project-image-stack">
      {project.images.map((src, index) => (
        <span key={`${src}-${index}`} style={{ display: "contents" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${project.title} - Image ${index + 1}`}
            className="project-stack-image"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </span>
      ))}
    </div>
  ) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": (project.description || project.summary || "").replace(/<[^>]*>?/gm, "").slice(0, 300),
    "image": project.images[0] || "",
    "url": `https://www.shapidesign.com/work/${project.slug}`,
    "author": { "@id": "https://www.shapidesign.com/#person" },
    "creator": { "@id": "https://www.shapidesign.com/#person" },
    "datePublished": project.year,
    "keywords": project.tags,
    "isPartOf": { "@id": "https://www.shapidesign.com/#website" },
  };

  return (
    <main className="section content-wrap project-detail project-detail-with-nav">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectHeaderObserver title={project.title}>
        <ProjectDetailContent project={project} />
      </ProjectHeaderObserver>

      {mediaNode && (
        <Reveal>
          <section className="project-media-shell">
            <div className="project-media-content">{mediaNode}</div>
          </section>
        </Reveal>
      )}

      <ProjectBodyBlock
        bodyHtml={project.description || project.bodyText}
        project={project}
      />

      <ProjectNavBar projects={projects} currentSlug={slug} />
    </main>
  );
}
