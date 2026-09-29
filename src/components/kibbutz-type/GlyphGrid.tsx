import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { FACES, faceHeName, type Face, type FaceId } from "./faces";
import { SpecimenText } from "./SpecimenText";

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
        <SpecimenText>{settings.glyphsLabel}</SpecimenText>
        {" · "}
        <SpecimenText key={face.id}>{faceHeName(face.id, settings)}</SpecimenText>
      </p>
      <div className="kt-toggle" role="group" aria-label="בחירת גופן למערכת הסימנים">
        {FACES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === face.id}
            onClick={() => onFace(item.id)}
          >
            {faceHeName(item.id, settings)}
          </button>
        ))}
      </div>
      {groups.map((group) => (
        <div className="kt-glyph-group" key={group.title}>
          <p className="kt-label">
            <SpecimenText>{group.title}</SpecimenText>
          </p>
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
              <SpecimenText>{settings.alternatesTitle}</SpecimenText>
            </p>
            <SpecimenText as="p" multiline>
              {settings.alternatesDescription}
            </SpecimenText>
          </div>
          <ul className="kt-alternates-list">
            {DAN_ALTERNATES.map(({ glyph, nameKey }) => {
              const name = String(settings[nameKey]);
              return (
              <li className="kt-alternate-item" key={glyph}>
                <span className="kt-alternate-name">
                  <SpecimenText>{name}</SpecimenText>
                </span>
                <div className="kt-alternate-forms">
                  <div className="kt-alternate-form">
                    <SpecimenText>{settings.baseLabel}</SpecimenText>
                    <span className="kt-alternate-glyph kt-alternate-glyph--base kt-face-dan">{glyph}</span>
                  </div>
                  <div className="kt-alternate-form">
                    <SpecimenText>{settings.alternateLabel}</SpecimenText>
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
