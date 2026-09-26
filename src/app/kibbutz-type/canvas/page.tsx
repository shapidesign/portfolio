import type { Metadata } from "next";
import { WallCanvas } from "@/components/kibbutz-type/WallCanvas";
import { getKibbutzTypeSettings } from "@/lib/project-overrides";
import { SITE_HOST } from "@/lib/site";
import "../kibbutz-type.css";

/** Unlisted presentation wall: reachable only by address, never indexed. */
export const metadata: Metadata = {
  title: "Kibbutz Type — הקיר",
  robots: { index: false, follow: false },
};

export default async function KibbutzTypeCanvasPage() {
  const settings = await getKibbutzTypeSettings();
  return <WallCanvas settings={settings} address={`${SITE_HOST}/kibbutz-type`} />;
}
