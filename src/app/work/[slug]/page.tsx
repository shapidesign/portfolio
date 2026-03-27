import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectHeaderObserver } from "@/components/ui/ProjectHeaderObserver";
import { ProjectNavBar } from "@/components/ui/ProjectNavBar";
import { getProjectBySlug, projects } from "@/data/projects";
import { DigitalHandprintEmbed } from "./DigitalHandprintEmbed";
import { DavidkaProjectEmbed } from "./DavidkaProjectEmbed";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function BodyBlocks({ lines }: { lines: string[] }) {
  type Block =
    | { kind: "text"; lines: string[] }
    | { kind: "bullets"; items: string[] }
    | { kind: "ordered"; items: string[] };

  const blocks: Block[] = [];

  for (const line of lines) {
    if (line.startsWith("•")) {
      const last = blocks[blocks.length - 1];
      const content = line.replace(/^•\s*/, "");
      if (last?.kind === "bullets") last.items.push(content);
      else blocks.push({ kind: "bullets", items: [content] });
    } else if (/^\d+\.\s/.test(line)) {
      const last = blocks[blocks.length - 1];
      const content = line.replace(/^\d+\.\s*/, "");
      if (last?.kind === "ordered") last.items.push(content);
      else blocks.push({ kind: "ordered", items: [content] });
    } else {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "text") last.lines.push(line);
      else blocks.push({ kind: "text", lines: [line] });
    }
  }

  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "bullets")
          return (
            <ul key={i} className="body-list">
              {block.items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        if (block.kind === "ordered")
          return (
            <ol key={i} className="body-list">
              {block.items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          );
        return (
          <p
            key={i}
            className="body-section-text"
            dangerouslySetInnerHTML={{ __html: block.lines.join("<br />") }}
          />
        );
      })}
    </>
  );
}

function ProjectBody({ rawHtml }: { rawHtml: string }) {
  const sanitized = rawHtml.replace(/<(?!\/?(?:strong|em|br\s*\/?)>)/gi, "&lt;");

  const normalized = sanitized.replace(
    /<strong>([\s\S]*?)<\/strong>/gi,
    (_, inner: string) =>
      `<strong>${inner.replace(/<br\s*\/?>/gi, " ").trim()}</strong>`
  );

  const sections = normalized
    .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
    .map((s) => s.replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "").trim())
    .filter(Boolean);

  return (
    <div className="body-sections">
      {sections.map((section, i) => {
        const headingMatch = section.match(
          /^<strong>([\s\S]*?)<\/strong>\s*(?:$|<br\s*\/?>)\s*([\s\S]*)/i
        );

        const heading = headingMatch?.[1]?.trim() || null;
        const bodyRaw = heading
          ? (headingMatch?.[2]
              ?.replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "")
              .trim() ?? "")
          : section;

        const bodyLines = bodyRaw
          ? bodyRaw
              .split(/<br\s*\/?>/gi)
              .map((l) => l.trim())
              .filter(Boolean)
          : [];

        return (
          <div key={i} className="body-section">
            {heading && (
              <h3
                className="body-section-label"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {bodyLines.length > 0 && <BodyBlocks lines={bodyLines} />}
          </div>
        );
      })}
    </div>
  );
}

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
        <Reveal>
          <p className="eyebrow">{project.subHeader || project.category}</p>
          <h1>{project.title}</h1>
          {project.context && (
            <p className="project-context-detail">{project.context}</p>
          )}
        </Reveal>
      </ProjectHeaderObserver>

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
          <ProjectBody rawHtml={project.description || project.bodyText} />
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

      <ProjectNavBar projects={projects} currentSlug={slug} />
    </main>
  );
}
