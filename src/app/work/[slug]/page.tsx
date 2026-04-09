import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectHeaderObserver } from "@/components/ui/ProjectHeaderObserver";
import { ProjectDetailContent, ProjectNarrativeSections } from "@/components/ui/ProjectDetailContent";
import { ProjectHeroImage } from "@/components/ui/ProjectHeroImage";
import { NextProjectCard } from "@/components/ui/NextProjectCard";
import { getProjectBySlug, projects } from "@/data/projects";
import { TetrisLoaderEmbed } from "@/components/ui/TetrisLoaderEmbed";
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

  const title = `${project.title} — Yehonatan Shapira`;
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
  const hasScrollImages = !isDigitalHandprint && !isDavidka && project.images.length > 0;
  const currentIndex = projects.findIndex((entry) => entry.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const embedNode = isDigitalHandprint ? (
    <DigitalHandprintEmbed />
  ) : isDavidka ? (
    <DavidkaProjectEmbed />
  ) : null;

  const scrollGalleryImages = project.images
    .filter((src) => !src.includes("tetris animation"))
    .filter(
      (src) =>
        !(slug === "animal-to-logo" && src.includes("alma + text.webp"))
    );

  const leadImage = scrollGalleryImages[0] || project.images[0];
  const editorialImages = scrollGalleryImages.slice(1);

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
    <main
      className="section content-wrap project-detail project-detail-with-nav"
      data-project-slug={slug}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectHeaderObserver title={project.title} heTitle={project.heTitle}>
        <ProjectDetailContent project={project} />
      </ProjectHeaderObserver>

      {leadImage && (
        <Reveal>
          <ProjectHeroImage src={leadImage} alt={`${project.title} hero`} />
        </Reveal>
      )}

      {embedNode && (
        <Reveal>
          <section className="project-media-shell">
            <div className="project-media-content">{embedNode}</div>
          </section>
        </Reveal>
      )}

      <ProjectNarrativeSections project={project} />

      {hasScrollImages && (
        <section className="project-editorial-work">
          {editorialImages.map((src, index) => (
            <Reveal key={`${src}-${index}`} delay={index * 50}>
              <figure className={`project-editorial-item ${index % 3 === 1 ? "project-editorial-item--half" : "project-editorial-item--full"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} - Image ${index + 2}`}
                  className="project-editorial-image"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </Reveal>
          ))}

          {slug === "no-gatekeeping" && (
            <Reveal>
              <TetrisLoaderEmbed />
            </Reveal>
          )}
        </section>
      )}

      <Reveal>
        <NextProjectCard project={nextProject} />
      </Reveal>
    </main>
  );
}
