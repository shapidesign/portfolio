"use client";

import { FACES, type Face, type FaceId } from "./faces";

type FacesShowcaseProps = Readonly<{
  face: Face;
  onFace: (id: FaceId) => void;
}>;

/* Size waterfall: display → text. Both faces are single-weight, so size is the axis. */
const SIZES = ["clamp(3rem, 8vw, 6.5rem)", "clamp(2rem, 4.5vw, 3.5rem)", "1.75rem", "1.125rem"];
const SAMPLES = [
  "חצרים הוא קיבוץ הנמצא מערבית לבאר שבע.",
  "הקיבוץ הוקם במוצאי יום כיפור בשנת 1946.",
  "במרכז הקיבוץ נמצא בית הביטחון.",
  "בשנת 1965 ייסד הקיבוץ את חברת נטפים.",
];

export function FacesShowcase({ face, onFace }: FacesShowcaseProps) {
  return (
    <section className="kt-section kt-section--faces kt-wrap" aria-labelledby="kt-faces-title">
      <p className="kt-label" id="kt-faces-title">
        הגופנים
      </p>
      <div className="kt-faces">
        {FACES.map((f) => (
          <article key={f.id}>
            <div className="kt-face-head">
              <button type="button" aria-pressed={f.id === face.id} onClick={() => onFace(f.id)}>
                {f.heName}
              </button>
              <span>{f.name}</span>
            </div>
            <div className={`kt-waterfall ${f.className}`} lang="he">
              {SIZES.map((size, index) => (
                <p key={size} style={{ fontSize: size }}>
                  {SAMPLES[index]}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="kt-source">
        מקור הטקסט:{" "}
        <a href="https://he.wikipedia.org/wiki/%D7%97%D7%A6%D7%A8%D7%99%D7%9D">
          ויקיפדיה — חצרים
        </a>
      </p>
    </section>
  );
}
