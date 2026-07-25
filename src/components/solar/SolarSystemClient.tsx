"use client";

import dynamic from "next/dynamic";
import type { Project } from "../../types/project";
import type { SiteCopy } from "@/lib/site-copy";

const SolarSystem = dynamic(() => import("./SolarSystem").then((m) => m.SolarSystem), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0b0613",
        display: "grid",
        placeItems: "center",
        color: "#7a56f2",
        fontFamily: "var(--font-courier), monospace",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontSize: "0.8rem",
        zIndex: 0,
      }}
    >
      Calibrating universe…
    </div>
  ),
});

export function SolarSystemClient({
  projects,
  siteCopy,
}: {
  projects: Project[];
  siteCopy?: SiteCopy;
}) {
  return <SolarSystem projects={projects} siteCopy={siteCopy} />;
}
