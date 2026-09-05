import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { FACES, type Face, type FaceId } from "./faces";

type GlyphGridProps = Readonly<{
  face: Face;
  settings: KibbutzTypeSettings;
  onFace: (id: FaceId) => void;
}>;

/** Exact ss01 substitutions from Meir-Dan.glyphs. */
const DAN_ALTERNATES = [
  { glyph: "א", nameKey: "alternateNameAlef" },
  { glyph: "ג", nameKey: "alternateNameGimel" },
  { glyph: "כ", nameKey: "alternateNameKaf" },
  { glyph: "ע", nameKey: "alternateNameAyin" },
  { glyph: "ף", nameKey: "alternateNameFinalPe" },
  { glyph: "פ", nameKey: "alternateNamePe" },
  { glyph: "צ", nameKey: "alternateNameTsadi" },
] as const satisfies ReadonlyArray<{
  glyph: string;
  nameKey: keyof KibbutzTypeSettings;
}>;

export function GlyphGrid({ face, settings, onFace }: GlyphGridProps) {
  const groups = [
    { title: settings.lettersLabel, glyphs: face.letters },
    { title: settings.digitsLabel, glyphs: face.digits },
    { title: settings.punctuationLabel, glyphs: face.punctuation },
  ];
  return (
    <section
      className={`kt-section kt-section--glyphs kt-face-ui--${face.id} kt-wrap`}
      aria-labelledby="kt-glyphs-title"
    >
      <p className="kt-label" id="kt-glyphs-title">
        {settings.glyphsLabel} · {face.id === "dan" ? settings.danHeName : settings.keltaHeName}
      </p>
      <div className="kt-toggle" role="group" aria-label="בחירת גופן למערכת הסימנים">
        {FACES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === face.id}
            onClick={() => onFace(item.id)}
          >
            {item.id === "dan" ? settings.danHeName : settings.keltaHeName}
          </button>
        ))}
      </div>
      {groups.map((group) => (
        <div className="kt-glyph-group" key={group.title}>
          <p className="kt-label">{group.title}</p>
          <div className={`kt-glyphs ${face.className}`} lang="he">
            {Array.from(group.glyphs).map((glyph, i) => (
              <span key={`${glyph}-${i}`}>{glyph}</span>
            ))}
          </div>
        </div>
      ))}
      {face.id === "dan" ? (
        <section className="kt-alternates" aria-labelledby="kt-alternates-title">
          <div className="kt-alternates-head">
            <p className="kt-label" id="kt-alternates-title">
              {settings.alternatesTitle}
            </p>
            <p>{settings.alternatesDescription}</p>
          </div>
          <ul className="kt-alternates-list">
            {DAN_ALTERNATES.map(({ glyph, nameKey }) => {
              const name = String(settings[nameKey]);
              return (
              <li className="kt-alternate-item" key={glyph} aria-label={`${name}: צורה בסיסית וחלופה`}>
                <span className="kt-alternate-name">{name}</span>
                <div className="kt-alternate-forms">
                  <div className="kt-alternate-form">
                    <span>{settings.baseLabel}</span>
                    <span className="kt-alternate-glyph kt-alternate-glyph--base kt-face-dan">{glyph}</span>
                  </div>
                  <div className="kt-alternate-form">
                    <span>{settings.alternateLabel}</span>
                    <span className="kt-alternate-glyph kt-alternate-glyph--ss01 kt-face-dan">{glyph}</span>
                  </div>
                </div>
              </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
