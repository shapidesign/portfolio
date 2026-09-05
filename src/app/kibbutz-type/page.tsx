import type { Metadata } from "next";
import { KibbutzType } from "@/components/kibbutz-type/KibbutzType";
import { SITE_ORIGIN } from "@/lib/site";
import "./kibbutz-type.css";

export const metadata: Metadata = {
  title: "Kibbutz Type — גופני חצרים 80",
  description:
    "Two Hebrew typefaces designed for Kibbutz Hatzerim's 80th anniversary: Dan Revived and Kelta 01. Type specimen and live tester.",
  alternates: { canonical: `${SITE_ORIGIN}/kibbutz-type/` },
  openGraph: {
    title: "Kibbutz Type — גופני חצרים 80",
    description:
      "Two Hebrew typefaces designed for Kibbutz Hatzerim's 80th anniversary: Dan Revived and Kelta 01.",
    url: `${SITE_ORIGIN}/kibbutz-type/`,
    type: "website",
  },
};

export default function KibbutzTypePage() {
  return <KibbutzType />;
}
