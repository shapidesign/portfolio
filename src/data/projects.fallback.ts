export type LegacyProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  services: string[];
  year: string;
  challenge: string;
  process: string;
  outcome: string;
  accent: "primary" | "secondary" | "blue" | "green" | "white";
  thumbnailShape: "square" | "circle" | "triangle";
  thumbnailHoverShape: "square" | "circle" | "triangle";
};

export const fallbackProjects: LegacyProject[] = [
  {
    slug: "logo-design",
    title: "Logo Design",
    category: "Brand Strategy",
    summary: "Building clear visual marks that stay recognizable across print and digital touchpoints.",
    services: ["Brand direction", "Logo systems", "Usage guide"],
    year: "2025",
    challenge:
      "Create a mark with strong character while keeping it flexible enough for different scales and contexts.",
    process:
      "I explored geometric constructions, tested readability at small sizes, and validated balance in monochrome and color versions.",
    outcome:
      "A robust logo system with lockups, spacing rules, and practical file variants for client deployment.",
    accent: "secondary",
    thumbnailShape: "circle",
    thumbnailHoverShape: "square"
  },
  {
    slug: "packaging-design",
    title: "Packaging Design",
    category: "Product Experience",
    summary: "Turning product stories into bold shelf presence with thoughtful structure and material clarity.",
    services: ["Structure concept", "Label system", "Production handoff"],
    year: "2025",
    challenge:
      "Balance visual impact with practical constraints such as print limitations and information hierarchy.",
    process:
      "I mapped key messaging, created modular label layouts, and iterated dielines with clear color coding.",
    outcome:
      "A packaging set that feels premium, communicates quickly, and remains consistent across product lines.",
    accent: "blue",
    thumbnailShape: "square",
    thumbnailHoverShape: "triangle"
  },
  {
    slug: "experimental-typography",
    title: "Experimental Typography",
    category: "Visual Research",
    summary: "Pushing letterforms and rhythm to discover expressive typographic systems for modern visual narratives.",
    services: ["Type exploration", "Poster compositions", "Motion-ready assets"],
    year: "2024",
    challenge:
      "Explore expressive typography while preserving enough structure to stay legible and communicative.",
    process:
      "I used constrained geometric modules, tested contrast and spacing, and documented repeatable composition patterns.",
    outcome:
      "A versatile collection of typographic studies used in campaigns, social layouts, and concept pitches.",
    accent: "primary",
    thumbnailShape: "triangle",
    thumbnailHoverShape: "circle"
  },
  {
    slug: "web-design",
    title: "Web Design",
    category: "Digital Product",
    summary: "Designing clean, responsive interfaces that elevate brand voice and guide users toward action.",
    services: ["UI system", "Responsive layouts", "Interaction design"],
    year: "2025",
    challenge:
      "Align creative brand expression with strong usability on desktop, tablet, and mobile interaction patterns.",
    process:
      "I built a scalable UI kit, tested navigation flows, and refined motion to avoid distraction and friction.",
    outcome:
      "A polished, high-performance web experience with clearer navigation and stronger conversion behavior.",
    accent: "green",
    thumbnailShape: "square",
    thumbnailHoverShape: "circle"
  },
  {
    slug: "thoughtful-design",
    title: "Thoughtful Design",
    category: "Concept Development",
    summary: "Design choices rooted in context, intent, and long-term usability rather than visual noise.",
    services: ["Concept framing", "Design rationale", "Cross-medium consistency"],
    year: "2024",
    challenge:
      "Create visual systems that feel unique while still being practical for real production environments.",
    process:
      "I translated strategy into modular components, validated assumptions with quick prototypes, and simplified where needed.",
    outcome:
      "A clearer visual direction that improved communication, reduced rework, and supported sustainable growth.",
    accent: "white",
    thumbnailShape: "circle",
    thumbnailHoverShape: "triangle"
  },
  {
    slug: "identity",
    title: "Identity",
    category: "Brand Identity",
    summary: "Crafting identity systems with strong personality, consistency, and room for future evolution.",
    services: ["Identity architecture", "Visual language", "Brand applications"],
    year: "2025",
    challenge:
      "Unify logo, color, typography, and shape language into one coherent system with enough flexibility.",
    process:
      "I established hierarchy rules, built reusable templates, and paired each decision with practical usage examples.",
    outcome:
      "A confident identity toolkit that supports campaigns, digital products, and printed materials.",
    accent: "secondary",
    thumbnailShape: "triangle",
    thumbnailHoverShape: "square"
  }
];
