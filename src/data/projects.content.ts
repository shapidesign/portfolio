import { Project } from "../types/project";

export const projectsContent: Project[] = [
  {
    slug: "brand-identity-system",
    title: "EcoWare Brand Identity",
    subHeader: "Sustainable Packaging Solutions",
    context: "",
    description: "A comprehensive brand identity for a sustainable packaging startup, focusing on clarity, trust, and environmental responsibility.",
    bodyText: "EcoWare needed a brand that spoke to both corporate partners and eco-conscious consumers. The result is a clean, modern identity that uses organic shapes and a grounded color palette to communicate reliability and natural origins.",
    url: "https://example.com/ecoware",
    images: [], // TODO: Add project images
    tags: ["Branding", "Identity", "Print"],
    category: "Brand Strategy",
    summary: "Building a trusted visual mark for sustainable packaging solutions.",
    services: ["Brand Strategy", "Visual Identity", "Collateral Design"],
    year: "2025",
    challenge: "The challenge was to differentiate EcoWare in a crowded market of 'green' brands without resorting to clichés like leaf icons or overly rustic aesthetics.",
    process: "We started with a deep dive into competitor analysis, identifying a gap for a more sophisticated, tech-forward sustainable brand. Iterative sketching led to a logo system based on modular geometry.",
    outcome: "A versatile identity system that scales from social media avatars to shipping container decals, increasing brand recognition by 40% in initial testing.",
    accent: "green",
    thumbnailShape: "circle",
    thumbnailHoverShape: "square"
  },
  {
    slug: "fintech-dashboard",
    title: "Nova Financial Dashboard",
    subHeader: "Data Visualization Platform",
    context: "",
    description: "Redesigning a complex financial analytics dashboard to improve user clarity and decision-making speed.",
    bodyText: "Nova's legacy platform was cluttered and difficult to navigate. We stripped it back to the essentials, introducing a modular card-based layout and a dark mode optimized for long working sessions.",
    url: "https://example.com/nova",
    images: [], // TODO: Add dashboard screenshots
    tags: ["UI/UX", "Product Design", "Data Viz"],
    category: "Digital Product",
    summary: "Simplifying complex financial data into actionable insights.",
    services: ["UX Research", "UI Design", "Design System"],
    year: "2025",
    challenge: "Balancing density of information with readability. Users needed to see real-time market data without being overwhelmed.",
    process: "We conducted user interviews with traders and analysts to understand their workflows. Wireframing focused on information hierarchy, ensuring critical data was always visible.",
    outcome: "A streamlined dashboard that reduced time-to-insight by 50% and received positive feedback for its intuitive navigation and reduced cognitive load.",
    accent: "blue",
    thumbnailShape: "square",
    thumbnailHoverShape: "triangle"
  },
  {
    slug: "art-gallery-site",
    title: "Modern Art Gallery",
    subHeader: "Immersive Digital Experience",
    context: "",
    description: "An interactive website for a contemporary art gallery, designed to showcase exhibitions and artist portfolios with minimal distraction.",
    bodyText: "The gallery needed a digital presence that felt as curated as their physical space. We used plenty of whitespace, subtle micro-interactions, and high-quality imagery to let the art speak for itself.",
    url: "https://example.com/gallery",
    images: [], // TODO: Add gallery website shots
    tags: ["Web Design", "Development", "Interaction"],
    category: "Web Design",
    summary: "A digital gallery space that honors the art it displays.",
    services: ["Web Design", "Frontend Dev", "CMS Integration"],
    year: "2024",
    challenge: "Creating a site that felt immersive and unique without overshadowing the artwork or confusing visitors.",
    process: "We prototyped several navigation concepts before settling on a horizontal scroll mechanic that mimics walking through a gallery. Performance optimization was key for loading high-res art assets.",
    outcome: "An award-winning website that increased online inquiries and exhibition attendance. The client praised the seamless CMS integration for easy updates.",
    accent: "primary",
    thumbnailShape: "triangle",
    thumbnailHoverShape: "circle"
  }
];
