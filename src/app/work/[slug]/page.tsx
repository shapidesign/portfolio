import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/ui/ProjectCaseStudy";
import { baseProjects } from "@/data/projects";
import { getProjectBySlug, getProjects } from "@/lib/project-overrides";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return baseProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = `${project.title} — Yehonatan Shapira`;
  const description = (project.description || project.summary || "")
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 160);
  const url = `${SITE_ORIGIN}/work/${slug}/`;
  const images =
    project.images.length > 0
      ? [{ url: project.images[0], width: 1200, height: 630, alt: `${project.title} — project by Yehonatan Shapira` }]
      : [];

  return {
    title,
    description,
    keywords: [...project.tags, "Yehonatan Shapira", "Alef Sofit", "design project"],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images,
      siteName: SITE_NAME
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
  const allProjects = await getProjects();
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": (project.description || project.summary || "").replace(/<[^>]*>?/gm, "").slice(0, 300),
    "image": project.images[0] || "",
    "url": `${SITE_ORIGIN}/work/${project.slug}/`,
    "author": { "@id": `${SITE_ORIGIN}/#person` },
    "creator": { "@id": `${SITE_ORIGIN}/#person` },
    "datePublished": project.year,
    "keywords": project.tags,
    "isPartOf": { "@id": `${SITE_ORIGIN}/#website` },
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
      <ProjectCaseStudy project={project} allProjects={allProjects} />
    </main>
  );
}
