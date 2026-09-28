import { getSiteCopy } from "@/lib/project-overrides";
import { AboutView } from "./AboutView";

export default async function AboutPage() {
  const siteCopy = await getSiteCopy();
  return <AboutView siteCopy={siteCopy} />;
}
