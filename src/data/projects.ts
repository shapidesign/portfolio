import generatedRaw from "./projects.generated.json";
import { fallbackProjects } from "./projects.fallback";

export type Accent = "primary" | "secondary" | "blue" | "green" | "white";
export type ShapeVariant = "square" | "circle" | "triangle";

export type Project = {
  slug: string;
  title: string;
  subHeader: string;
  description: string;
  bodyText: string;
  url?: string;
  images: string[];
  tags: string[];
  category: string;
  summary: string;
  services: string[];
  year: string;
  challenge: string;
  process: string;
  outcome: string;
  accent: Accent;
  thumbnailShape: ShapeVariant;
  thumbnailHoverShape: ShapeVariant;
};

const VALID_ACCENTS: Accent[] = ["primary", "secondary", "blue", "green", "white"];
const VALID_SHAPES: ShapeVariant[] = ["square", "circle", "triangle"];

function isAccent(value: unknown): value is Accent {
  return typeof value === "string" && VALID_ACCENTS.includes(value as Accent);
}

function isShape(value: unknown): value is ShapeVariant {
  return typeof value === "string" && VALID_SHAPES.includes(value as ShapeVariant);
}

function cleanString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item)).filter(Boolean);
}

function normalizeProject(input: unknown, index: number): Project | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const title = cleanString(raw.title, "");
  const slug = cleanString(raw.slug, "");
  if (!title || !slug) return null;

  const description = cleanString(raw.description, cleanString(raw.summary, "Project summary coming soon."));
  const bodyText = cleanString(raw.bodyText, description);
  const tags = cleanStringArray(raw.tags);
  const services = cleanStringArray(raw.services);
  const fallbackTagList = services.length > 0 ? services : tags;

  return {
    slug,
    title,
    subHeader: cleanString(raw.subHeader, cleanString(raw.category, "Project")),
    description,
    bodyText,
    url: cleanString(raw.url) || undefined,
    images: cleanStringArray(raw.images),
    tags: tags.length > 0 ? tags : fallbackTagList,
    category: cleanString(raw.category, cleanString(raw.subHeader, "Project")),
    summary: cleanString(raw.summary, description),
    services: services.length > 0 ? services : tags,
    year: cleanString(raw.year, String(new Date().getFullYear())),
    challenge: cleanString(raw.challenge, bodyText),
    process: cleanString(raw.process, bodyText),
    outcome: cleanString(raw.outcome, bodyText),
    accent: isAccent(raw.accent) ? raw.accent : VALID_ACCENTS[index % VALID_ACCENTS.length],
    thumbnailShape: isShape(raw.thumbnailShape) ? raw.thumbnailShape : VALID_SHAPES[index % VALID_SHAPES.length],
    thumbnailHoverShape: isShape(raw.thumbnailHoverShape)
      ? raw.thumbnailHoverShape
      : VALID_SHAPES[(index + 1) % VALID_SHAPES.length]
  };
}

const generatedProjects = Array.isArray(generatedRaw)
  ? generatedRaw
      .map((item, index) => normalizeProject(item, index))
      .filter((project): project is Project => project !== null)
  : [];

const normalizedFallback = fallbackProjects
  .map((project, index) =>
    normalizeProject(
      {
        ...project,
        subHeader: project.category,
        description: project.summary,
        bodyText: project.outcome,
        tags: project.services,
        url: undefined,
        images: []
      },
      index
    )
  )
  .filter((project): project is Project => project !== null);

export const projects: Project[] = generatedProjects.length > 0 ? generatedProjects : normalizedFallback;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
