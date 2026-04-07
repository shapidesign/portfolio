"use client";

import dynamic from "next/dynamic";

const DigitalHandprintPreview = dynamic(
  () =>
    import("./DigitalHandprintPreview").then((m) => m.DigitalHandprintPreview),
  { ssr: false },
);

const DavidkaTypewriterPreview = dynamic(
  () =>
    import("./DavidkaTypewriterPreview").then((m) => m.DavidkaTypewriterPreview),
  { ssr: false },
);

export function CardPreview({ slug }: { slug: string }) {
  if (slug === "digital-handprint") return <DigitalHandprintPreview />;
  if (slug === "small-world-problems") return <DavidkaTypewriterPreview />;
  return null;
}
