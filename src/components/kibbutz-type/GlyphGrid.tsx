import { FACES, type Face, type FaceId } from "./faces";

type GlyphGridProps = Readonly<{
  face: Face;
  onFace: (id: FaceId) => void;
}>;

/** Exact ss01 substitutions from Meir-Dan.glyphs. */
const DAN_ALTERNATES = [
  { glyph: "א", name: "אלף" },
  { glyph: "ג", name: "גימל" },
  { glyph: "כ", name: "כף" },
  { glyph: "ע", name: "עין" },
  { glyph: "ף", name: "פא סופית" },
  { glyph: "פ", name: "פא" },
  { glyph: "צ", name: "צדי" },
];

export function GlyphGrid({ face, onFace }: GlyphGridProps) {
  const groups = [
    { title: "אותיות", glyphs: face.letters },
    { title: "ספרות", glyphs: face.digits },
    { title: "סימנים", glyphs: face.punctuation },
  ];
  return (
    <section
      className={`kt-section kt-section--glyphs kt-face-ui--${face.id} kt-wrap`}
      aria-labelledby="kt-glyphs-title"
    >
      <p className="kt-label" id="kt-glyphs-title">
        מערכת הסימנים · {face.heName}
      </p>
      <div className="kt-toggle" role="group" aria-label="בחירת גופן למערכת הסימנים">
        {FACES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === face.id}
            onClick={() => onFace(item.id)}
          >
            {item.heName}
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
              אותיות חלופיות · ss01
            </p>
            <p>השוואה בין הצורה הבסיסית לחלופה הסגנונית.</p>
          </div>
          <ul className="kt-alternates-list">
            {DAN_ALTERNATES.map(({ glyph, name }) => (
              <li className="kt-alternate-item" key={glyph} aria-label={`${name}: צורה בסיסית וחלופה`}>
                <span className="kt-alternate-name">{name}</span>
                <div className="kt-alternate-forms">
                  <div className="kt-alternate-form">
                    <span>בסיס</span>
                    <span className="kt-alternate-glyph kt-alternate-glyph--base kt-face-dan">{glyph}</span>
                  </div>
                  <div className="kt-alternate-form">
                    <span>חלופה</span>
                    <span className="kt-alternate-glyph kt-alternate-glyph--ss01 kt-face-dan">{glyph}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
