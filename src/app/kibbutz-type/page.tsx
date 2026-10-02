import type { Metadata } from "next";
import { KibbutzType } from "@/components/kibbutz-type/KibbutzType";
import { getKibbutzTypeSettings } from "@/lib/project-overrides";
import { SITE_ORIGIN } from "@/lib/site";
import "./kibbutz-type.css";

export const metadata: Metadata = {
  title: "Kibbutz Type — Dan Revived, Kelta 01, Babayit",
  description:
    "Three Hebrew typefaces designed for Kibbutz Hatzerim's 80th anniversary: Dan Revived, Kelta 01, and Babayit. Type specimen and live tester.",
  alternates: { canonical: `${SITE_ORIGIN}/kibbutz-type/` },
  openGraph: {
    title: "Kibbutz Type — Dan Revived, Kelta 01, Babayit",
    description:
      "Three Hebrew typefaces designed for Kibbutz Hatzerim's 80th anniversary: Dan Revived, Kelta 01, and Babayit.",
    url: `${SITE_ORIGIN}/kibbutz-type/`,
    type: "website",
  },
};

export default async function KibbutzTypePage() {
  const settings = await getKibbutzTypeSettings();
  return <KibbutzType settings={settings} />;
}
