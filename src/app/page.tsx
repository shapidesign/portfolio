import { SolarSystemClient } from "@/components/solar/SolarSystemClient";
import { projects } from "@/data/projects";
import "@/styles/solar.css";

export default function HomePage() {
  return <SolarSystemClient projects={projects} />;
}
