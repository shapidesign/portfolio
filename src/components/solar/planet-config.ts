import * as THREE from "three";
import type { PlanetConfig } from "./Planet";
import type { Project } from "../../types/project";

type Subject = {
  id: string;
  title: string;
  heTitle: string;
  accent: string;
  projectSlugs: string[];
  ringed?: boolean;
};

/** Each subject is a planet; its projects orbit it as moons. */
export const SUBJECTS: Subject[] = [
  {
    id: "subject-brand",
    title: "Logo & Brand Design",
    heTitle: "מיתוג ועיצוב לוגו",
    accent: "#e6db74",
    projectSlugs: ["rethinking-real-estate", "keeping-it-clean"],
  },
  {
    id: "subject-type",
    title: "Typography",
    heTitle: "טיפוגרפיה",
    accent: "#3b82f6",
    projectSlugs: ["kibbutz-type", "small-world-problems"],
    ringed: true,
  },
  {
    id: "subject-web",
    title: "Web Design",
    heTitle: "עיצוב אתרים",
    accent: "#a6e22e",
    projectSlugs: ["no-gatekeeping"],
  },
  {
    id: "subject-experimental",
    title: "Experimental",
    heTitle: "ניסיוני",
    accent: "#f92672",
    projectSlugs: ["digital-handprint"],
  },
];

const ORBIT_RADII = [8, 12, 16, 20];
const ORBIT_SPEEDS = [0.3, 0.22, 0.17, 0.13];
const ORBIT_TILTS = [0.08, -0.06, 0.12, -0.1];
const PLANET_SIZES = [1.1, 1.25, 1.05, 1.15];

/** Gap between the parent's ring edge and the first moon orbit. */
const MOON_CLEARANCE = 0.9;
const MOON_SPACING = 1.25;
const MOON_SIZES = [0.46, 0.4, 0.43];
const MOON_SPEEDS = [0.55, 0.38, 0.47];
const MOON_TILTS = [0.18, -0.24, 0.1];
// Alternate hue nudges and brightness so siblings read as related but distinct.
const MOON_HSL_SHIFTS: [number, number, number][] = [
  [0.035, 0.05, 0.13],
  [-0.04, -0.05, -0.12],
  [0.07, 0, 0.06],
];

/** World-scale radius of the outermost moon orbit, for camera framing. */
export function outerMoonRadius(planet: PlanetConfig) {
  const moons = planet.moons ?? [];
  if (!moons.length) return planet.size * 2.35;
  return Math.max(...moons.map((m) => m.radius + m.size * (m.ringed ? 2.35 : 1)));
}

export function buildPlanetConfigs(projects: Project[]): PlanetConfig[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  return SUBJECTS.map((subject, i) => {
    const size = PLANET_SIZES[i];
    // Moons live in the parent group's (unscaled) space, so clear the ring in world units.
    const firstOrbit = size * (subject.ringed ? 2.35 : 1.3) + MOON_CLEARANCE;
    const subjectProjects = subject.projectSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Project => !!p);

    const moons: PlanetConfig[] = subjectProjects.map((project, m) => {
      const [dh, ds, dl] = MOON_HSL_SHIFTS[m % MOON_HSL_SHIFTS.length];
      const accent = `#${new THREE.Color(subject.accent).offsetHSL(dh, ds, dl).getHexString()}`;
      return {
        slug: project.slug,
        title: project.title,
        heTitle: project.heTitle,
        accent,
        radius: firstOrbit + m * MOON_SPACING,
        speed: MOON_SPEEDS[m % MOON_SPEEDS.length],
        startAngle: (m / subjectProjects.length) * Math.PI * 2 + i,
        tilt: MOON_TILTS[m % MOON_TILTS.length],
        size: MOON_SIZES[m % MOON_SIZES.length],
        // The outer moon of a pair wears a thin ring so siblings differ in silhouette.
        ringed: subjectProjects.length > 1 && m === subjectProjects.length - 1,
      };
    });

    return {
      slug: subject.id,
      title: subject.title,
      heTitle: subject.heTitle,
      accent: subject.accent,
      radius: ORBIT_RADII[i],
      speed: ORBIT_SPEEDS[i],
      startAngle: (i / SUBJECTS.length) * Math.PI * 2,
      tilt: ORBIT_TILTS[i],
      size,
      ringed: subject.ringed,
      moons,
    };
  });
}
