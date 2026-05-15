import type { PlanetConfig } from "./Planet";
import type { Project } from "../../types/project";

const ACCENT_BY_SLUG: Record<string, string> = {
  "digital-handprint": "#f92672",
  "small-world-problems": "#66d9ef",
  "no-gatekeeping": "#a6e22e",
  "keeping-it-clean": "#fd971f",
  "the-misfit-market": "#e6db74",
  "animal-to-logo": "#f8f8f2",
};

const FALLBACK_ACCENTS = ["#f92672", "#66d9ef", "#a6e22e", "#fd971f", "#e6db74", "#f8f8f2"];

const ORBIT_RADII = [7.5, 10.5, 13.5, 16.5, 19.5, 22.5];
const ORBIT_SPEEDS = [0.34, 0.28, 0.22, 0.18, 0.15, 0.12];
const ORBIT_TILTS = [0.08, -0.06, 0.12, -0.1, 0.04, -0.14];
const PLANET_SIZES = [0.95, 1.05, 1, 1.15, 1, 1.1];

export function buildPlanetConfigs(projects: Project[]): PlanetConfig[] {
  return projects.slice(0, 6).map((project, i) => ({
    slug: project.slug,
    title: project.title,
    heTitle: project.heTitle,
    accent: ACCENT_BY_SLUG[project.slug] ?? FALLBACK_ACCENTS[i % FALLBACK_ACCENTS.length],
    radius: ORBIT_RADII[i],
    speed: ORBIT_SPEEDS[i],
    startAngle: (i / 6) * Math.PI * 2,
    tilt: ORBIT_TILTS[i],
    size: PLANET_SIZES[i],
  }));
}
