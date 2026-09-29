"use client";

import type { CSSProperties } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { FACES, faceEnName, faceHeName } from "./faces";
import { SpecimenText } from "./SpecimenText";

type FacesShowcaseProps = Readonly<{
  settings: KibbutzTypeSettings;
}>;

/* Size waterfall: display → text. */
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
        <SpecimenText>{settings.facesLabel}</SpecimenText>
      </p>
      <div className="kt-faces">
        {FACES.map((f) => (
          <article key={f.id} className={`kt-face-panel--${f.id}`}>
            <div className="kt-face-head">
              <h2 className="kt-face-heading">
                <SpecimenText>{faceHeName(f.id, settings)}</SpecimenText>
              </h2>
              <SpecimenText>{faceEnName(f.id, settings)}</SpecimenText>
            </div>
            {/* Babayit pinned to its regular width; the wdth axis is demoed by the page slider */}
            <div
              className={`kt-waterfall ${f.className}`}
              lang="he"
              style={f.id === "babayit" ? ({ "--kt-wdth": "500" } as CSSProperties) : undefined}
            >
              {SIZES.map((size, index) => (
                <p key={size} style={{ fontSize: size }}>
                  <SpecimenText>{samples[index]}</SpecimenText>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="kt-source">
        <SpecimenText>{settings.sourcePrefix}</SpecimenText>{" "}
        <a href={settings.sourceUrl}>
          {settings.sourceLabel}
        </a>
      </p>
    </section>
  );
}
