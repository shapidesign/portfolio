import { SolarSystemClient } from "@/components/solar/SolarSystemClient";
import { getProjects, getSiteCopy } from "@/lib/project-overrides";
import "@/styles/solar.css";

export default async function HomePage() {
  const [projects, siteCopy] = await Promise.all([getProjects(), getSiteCopy()]);
  return <SolarSystemClient projects={projects} siteCopy={siteCopy} />;
}
