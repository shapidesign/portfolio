"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import type { Project } from "@/types/project";

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

type Props = {
  project: Project;
};

export function ProjectDetailContent({ project }: Props) {
  const { isHebrew } = useLanguage();
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  const title = (isHebrew && project.heTitle) || project.title;
  const subHeader = (isHebrew && project.heSubHeader) || project.subHeader || project.category;
  const context = (isHebrew && project.heContext) || project.context;
  const tags = isHebrew && project.heTags?.length ? project.heTags : project.tags;

  return (
    <>
      <Reveal>
        <p className="eyebrow">{subHeader}</p>
        <h1>{title}</h1>
        {context && <p className="project-context-detail">{context}</p>}
      </Reveal>

      <Reveal>
        <div className="meta-row">
          {tags.length > 0 &&
            tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          {project.year && <span className="meta-year">{project.year}</span>}
        </div>
      </Reveal>

      {project.url && (
        <Reveal>
          <div className="visit-project-link">
            <a href={project.url} className="button button-ghost" target="_blank" rel="noreferrer noopener">
              {s.visitProject}
            </a>
          </div>
        </Reveal>
      )}

    </>
  );
}

type BodyBlockProps = {
  bodyHtml: string;
  project: Project;
};

export function ProjectBodyBlock({ bodyHtml, project }: BodyBlockProps) {
  const { isHebrew } = useLanguage();
  const body = (isHebrew && project.heDescription) || bodyHtml;

  if (!body) return null;

  return (
    <Reveal>
      <section className="detail-block">
        <ProjectBody rawHtml={body} />
      </section>
    </Reveal>
  );
}
