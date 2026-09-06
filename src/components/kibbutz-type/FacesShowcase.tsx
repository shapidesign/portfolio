"use client";

import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { FACES } from "./faces";

type FacesShowcaseProps = Readonly<{
  settings: KibbutzTypeSettings;
}>;

/* Size waterfall: display → text. Both faces are single-weight, so size is the axis. */
const SIZES = ["clamp(3rem, 8vw, 6.5rem)", "clamp(2rem, 4.5vw, 3.5rem)", "1.75rem", "1.125rem"];
export function FacesShowcase({ settings }: FacesShowcaseProps) {
  const samples = [
    settings.waterfallLine1,
    settings.waterfallLine2,
    settings.waterfallLine3,
    settings.waterfallLine4,
  ];
  return (
    <section className="kt-section kt-section--faces kt-wrap" aria-labelledby="kt-faces-title">
      <p className="kt-label" id="kt-faces-title">
        {settings.facesLabel}
      </p>
      <div className="kt-faces">
        {FACES.map((f) => (
          <article key={f.id}>
            <div className="kt-face-head">
              <h2 className="kt-face-heading">
                {f.id === "dan" ? settings.danHeName : settings.keltaHeName}
              </h2>
              <span>{f.id === "dan" ? settings.danName : settings.keltaName}</span>
            </div>
            <div className={`kt-waterfall ${f.className}`} lang="he">
              {SIZES.map((size, index) => (
                <p key={size} style={{ fontSize: size }}>
                  {samples[index]}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="kt-source">
        {settings.sourcePrefix}{" "}
        <a href={settings.sourceUrl}>
          {settings.sourceLabel}
        </a>
      </p>
    </section>
  );
}
