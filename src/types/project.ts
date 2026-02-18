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
