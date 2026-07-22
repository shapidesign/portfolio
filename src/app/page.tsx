import { SolarSystemClient } from "@/components/solar/SolarSystemClient";
import { getProjects } from "@/lib/project-overrides";
import "@/styles/solar.css";

export default async function HomePage() {
  const projects = await getProjects();
  return <SolarSystemClient projects={projects} />;
}
