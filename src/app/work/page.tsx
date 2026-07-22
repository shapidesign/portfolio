import { WorkPageClient } from "./WorkPageClient";
import { getProjects } from "@/lib/project-overrides";

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkPageClient projects={projects} />;
}
