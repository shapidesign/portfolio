/**
 * Editable content for /kibbutz-type/.
 *
 * ponytail: this uses one reserved row in the existing project_overrides
 * table. Font binaries, glyph coverage, and OpenType mappings stay in code
 * because editing those as content would produce a false specimen.
 */
export const KIBBUTZ_TYPE_SLUG = "__kibbutz-type__";

export type KibbutzTypeSettings = {
  backLabel: string;
  navBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  testerLabel: string;
  testerDefaultText: string;
  testerDefaultFontSize: number;
  fontSizeLabel: string;
  alternatesLabel: string;
  facesLabel: string;
  danName: string;
  danHeName: string;
  keltaName: string;
  keltaHeName: string;
  waterfallLine1: string;
  waterfallLine2: string;
  waterfallLine3: string;
  waterfallLine4: string;
  sourcePrefix: string;
  sourceLabel: string;
  sourceUrl: string;
  glyphsLabel: string;
  lettersLabel: string;
  digitsLabel: string;
  punctuationLabel: string;
  alternatesTitle: string;
  alternatesDescription: string;
  baseLabel: string;
  alternateLabel: string;
  alternateNameAlef: string;
  alternateNameGimel: string;
  alternateNameKaf: string;
  alternateNameAyin: string;
  alternateNameFinalPe: string;
  alternateNamePe: string;
  alternateNameTsadi: string;
  aboutLabel: string;
  aboutLead: string;
  danHeading: string;
  danSubtitle: string;
  danParagraph1: string;
  danParagraph2: string;
  danCatalogSrc: string;
  danCatalogCaption: string;
  danTextileSrc: string;
  danTextileCaption: string;
  keltaHeading: string;
  keltaSubtitle: string;
  keltaParagraph1: string;
  keltaParagraph2: string;
  keltaPosterSrc: string;
  keltaPosterCaption: string;
  footerCredit: string;
  footerTagline: string;
  colorCream: string;
  colorNavy: string;
  colorGreen: string;
  colorOrange: string;
};

export const KIBBUTZ_TYPE_DEFAULTS: KibbutzTypeSettings = {
  backLabel: "→ חזרה לדף הבית",
  navBadge: "חצרים 80 · 1946–2026",
  heroTitleLine1: "גופנים חדשים",
  heroTitleLine2: "שמונים לחצרים",
  heroDescription:
    "משפחת גופנים עבריים שעוצבה לחגיגות שמונים שנה לקיבוץ חצרים. דן מחודש וקלטה 01.",
  testerLabel: "נסו בעצמכם",
  testerDefaultText: "שמונים שנה לחצרים",
  testerDefaultFontSize: 72,
  fontSizeLabel: "גודל",
  alternatesLabel: "אותיות חלופיות",
  facesLabel: "הגופנים",
  danName: "Dan Revived",
  danHeName: "דן מחודש",
  keltaName: "Kelta 01",
  keltaHeName: "קלטה 01",
  waterfallLine1: "חצרים הוא קיבוץ הנמצא מערבית לבאר שבע.",
  waterfallLine2: "הקיבוץ הוקם במוצאי יום כיפור בשנת 1946.",
  waterfallLine3: "במרכז הקיבוץ נמצא בית הביטחון.",
  waterfallLine4: "בשנת 1965 ייסד הקיבוץ את חברת נטפים.",
  sourcePrefix: "מקור הטקסט:",
  sourceLabel: "ויקיפדיה — חצרים",
  sourceUrl: "https://he.wikipedia.org/wiki/%D7%97%D7%A6%D7%A8%D7%99%D7%9D",
  glyphsLabel: "מערכת הסימנים",
  lettersLabel: "אותיות",
  digitsLabel: "ספרות",
  punctuationLabel: "סימנים",
  alternatesTitle: "אותיות חלופיות · ss01",
  alternatesDescription: "השוואה בין הצורה הבסיסית לחלופה הסגנונית.",
  baseLabel: "בסיס",
  alternateLabel: "חלופה",
  alternateNameAlef: "אלף",
  alternateNameGimel: "גימל",
  alternateNameKaf: "כף",
  alternateNameAyin: "עין",
  alternateNameFinalPe: "פא סופית",
  alternateNamePe: "פא",
  alternateNameTsadi: "צדי",
  aboutLabel: "על הפרויקט",
  aboutLead:
    "קיבוץ חצרים נוסד ב-1946 בנגב. לכבוד שמונים שנותיו עוצבו שני גופנים עבריים: אחד מחייה גופן טרנספר קלאסי שהודבק על כרזות הקיבוץ, והשני מתרגם את כתב היד של הכרזות עצמן לגופן חי.",
  danHeading: "דן מחודש",
  danSubtitle: "Dan Revived · חידוש לגופן ״דן״ של דן תל ורדי",
  danParagraph1:
    "סביב שנות ה-70-80 עיצב דן תל ורדי את ״דן״ - גופן עברי גאומטרי שהופץ על גיליונות אותיות טרנספר של לטרסט, והודבק אות-אות על כרזות, שלטים ועלוני חג בקיבוצים ברחבי הארץ. הגופן שימש את הלוגו של סמל וחולצות ״קבוץ חצרים״ המוכרות לכולם.",
  danParagraph2:
    "דן מחודש מחזיר את האותיות האלה למסך: הצורות המקוריות נשמרו, המידות והריווח הותאמו לטקסט דיגיטלי, והתוצאה היא גופן כותרות גאומטרי, עגלגל ופשוט.",
  danCatalogSrc: "/images/kibbutz-type/dan-letraset-catalog.jpg",
  danCatalogCaption: "קטלוג לטרסט · דן",
  danTextileSrc: "/images/kibbutz-type/kibbutz-hatzerim-textile.jpg",
  danTextileCaption: "סמל קבוץ חצרים על חולצה",
  keltaHeading: "קלטה 01",
  keltaSubtitle: "Kelta 01 · גופן חדש שנולד מכתב היד של כרזות הקיבוץ",
  keltaParagraph1:
    "בארכיון הקיבוץ שמורות כרזות שנכתבו בטושים שחורים על בריסטול לחג, לאסיפה, לערב שירה. הכתב הזה הוא הקול החזותי של חצרים במשך עשרות שנים.",
  keltaParagraph2:
    "קלטה 01 נולד מהכרזות האלה. הוא לא מעתיק כתב יד ספציפי אלא מזקק את הקצב, הקווים המחוברים והחום שלו לגופן שאפשר להקליד בו — כדי שגם השנה, ההזמנה לחג תיראה כמו שלנו.",
  keltaPosterSrc: "/images/kibbutz-type/kelta-poster.jpg",
  keltaPosterCaption: "כרזה כתובה ביד מארכיון קיבוץ חצרים",
  footerCredit: "עיצוב: יהונתן שפירא",
  footerTagline: "Kibbutz Type · Hatzerim 80",
  colorCream: "#f3efe3",
  colorNavy: "#101d3b",
  colorGreen: "#08743f",
  colorOrange: "#f15a24",
};

export type KibbutzTypeField = {
  key: keyof KibbutzTypeSettings;
  label: string;
  type?: "text" | "textarea" | "url" | "number" | "color";
  dir?: "rtl" | "ltr";
};

export type KibbutzTypeFieldGroup = {
  title: string;
  fields: KibbutzTypeField[];
};

export const KIBBUTZ_TYPE_FIELD_GROUPS: KibbutzTypeFieldGroup[] = [
  {
    title: "Header",
    fields: [
      { key: "backLabel", label: "Back link", dir: "rtl" },
      { key: "navBadge", label: "Anniversary badge", dir: "rtl" },
      { key: "heroTitleLine1", label: "Hero — line 1", dir: "rtl" },
      { key: "heroTitleLine2", label: "Hero — line 2", dir: "rtl" },
      { key: "heroDescription", label: "Hero description", type: "textarea", dir: "rtl" },
    ],
  },
  {
    title: "Tester",
    fields: [
      { key: "testerLabel", label: "Section label", dir: "rtl" },
      { key: "testerDefaultText", label: "Default text", type: "textarea", dir: "rtl" },
      { key: "testerDefaultFontSize", label: "Default font size", type: "number" },
      { key: "fontSizeLabel", label: "Size control label", dir: "rtl" },
      { key: "alternatesLabel", label: "Alternates control label", dir: "rtl" },
    ],
  },
  {
    title: "Font names and size showcase",
    fields: [
      { key: "facesLabel", label: "Section label", dir: "rtl" },
      { key: "danName", label: "Dan — English name" },
      { key: "danHeName", label: "Dan — Hebrew name", dir: "rtl" },
      { key: "keltaName", label: "Kelta — English name" },
      { key: "keltaHeName", label: "Kelta — Hebrew name", dir: "rtl" },
      { key: "waterfallLine1", label: "Large sample", type: "textarea", dir: "rtl" },
      { key: "waterfallLine2", label: "Medium sample", type: "textarea", dir: "rtl" },
      { key: "waterfallLine3", label: "Small sample", type: "textarea", dir: "rtl" },
      { key: "waterfallLine4", label: "Body sample", type: "textarea", dir: "rtl" },
      { key: "sourcePrefix", label: "Source prefix", dir: "rtl" },
      { key: "sourceLabel", label: "Source link label", dir: "rtl" },
      { key: "sourceUrl", label: "Source URL", type: "url" },
    ],
  },
  {
    title: "Glyph showcase",
    fields: [
      { key: "glyphsLabel", label: "Section title", dir: "rtl" },
      { key: "lettersLabel", label: "Letters label", dir: "rtl" },
      { key: "digitsLabel", label: "Digits label", dir: "rtl" },
      { key: "punctuationLabel", label: "Punctuation label", dir: "rtl" },
      { key: "alternatesTitle", label: "Alternates title", dir: "rtl" },
      { key: "alternatesDescription", label: "Alternates description", type: "textarea", dir: "rtl" },
      { key: "baseLabel", label: "Base form label", dir: "rtl" },
      { key: "alternateLabel", label: "Alternate form label", dir: "rtl" },
      { key: "alternateNameAlef", label: "Alternate name — א", dir: "rtl" },
      { key: "alternateNameGimel", label: "Alternate name — ג", dir: "rtl" },
      { key: "alternateNameKaf", label: "Alternate name — כ", dir: "rtl" },
      { key: "alternateNameAyin", label: "Alternate name — ע", dir: "rtl" },
      { key: "alternateNameFinalPe", label: "Alternate name — ף", dir: "rtl" },
      { key: "alternateNamePe", label: "Alternate name — פ", dir: "rtl" },
      { key: "alternateNameTsadi", label: "Alternate name — צ", dir: "rtl" },
    ],
  },
  {
    title: "About",
    fields: [
      { key: "aboutLabel", label: "Section label", dir: "rtl" },
      { key: "aboutLead", label: "Introduction", type: "textarea", dir: "rtl" },
      { key: "danHeading", label: "Dan heading", dir: "rtl" },
      { key: "danSubtitle", label: "Dan subtitle", type: "textarea", dir: "rtl" },
      { key: "danParagraph1", label: "Dan paragraph 1", type: "textarea", dir: "rtl" },
      { key: "danParagraph2", label: "Dan paragraph 2", type: "textarea", dir: "rtl" },
      { key: "danCatalogCaption", label: "Catalog caption", dir: "rtl" },
      { key: "danTextileCaption", label: "Textile caption", dir: "rtl" },
      { key: "keltaHeading", label: "Kelta heading", dir: "rtl" },
      { key: "keltaSubtitle", label: "Kelta subtitle", type: "textarea", dir: "rtl" },
      { key: "keltaParagraph1", label: "Kelta paragraph 1", type: "textarea", dir: "rtl" },
      { key: "keltaParagraph2", label: "Kelta paragraph 2", type: "textarea", dir: "rtl" },
      { key: "keltaPosterCaption", label: "Poster caption", dir: "rtl" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footerCredit", label: "Credit", dir: "rtl" },
      { key: "footerTagline", label: "Tagline" },
    ],
  },
  {
    title: "Colors",
    fields: [
      { key: "colorCream", label: "Cream", type: "color" },
      { key: "colorNavy", label: "Dan navy", type: "color" },
      { key: "colorGreen", label: "Kelta green", type: "color" },
      { key: "colorOrange", label: "UI accent", type: "color" },
    ],
  },
];

export const KIBBUTZ_TYPE_MEDIA_FIELDS = [
  { key: "danCatalogSrc", label: "Dan — Letraset catalog" },
  { key: "danTextileSrc", label: "Dan — Hatzerim textile" },
  { key: "keltaPosterSrc", label: "Kelta — archive poster" },
] as const satisfies ReadonlyArray<{
  key: keyof KibbutzTypeSettings;
  label: string;
}>;

const STRING_KEYS = new Set<keyof KibbutzTypeSettings>(
  Object.keys(KIBBUTZ_TYPE_DEFAULTS).filter(
    (key) => key !== "testerDefaultFontSize",
  ) as (keyof KibbutzTypeSettings)[],
);
const COLOR_KEYS = new Set<keyof KibbutzTypeSettings>([
  "colorCream",
  "colorNavy",
  "colorGreen",
  "colorOrange",
]);
const MEDIA_KEYS = new Set<keyof KibbutzTypeSettings>([
  "danCatalogSrc",
  "danTextileSrc",
  "keltaPosterSrc",
]);
const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

function isSafeValue(key: keyof KibbutzTypeSettings, value: string): boolean {
  if (COLOR_KEYS.has(key)) return HEX_COLOR_RE.test(value);
  if (MEDIA_KEYS.has(key)) return value.startsWith("/") && !value.startsWith("//");
  if (key === "sourceUrl") {
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }
  return true;
}

/** Keep only known keys and values safe for the public page. */
export function sanitizeKibbutzTypeSettings(
  input: Record<string, unknown>,
): Partial<KibbutzTypeSettings> {
  const out: Partial<KibbutzTypeSettings> = {};
  for (const [rawKey, value] of Object.entries(input)) {
    const key = rawKey as keyof KibbutzTypeSettings;
    if (key === "testerDefaultFontSize" && typeof value === "number" && Number.isFinite(value)) {
      out.testerDefaultFontSize = Math.min(200, Math.max(24, Math.round(value)));
    } else if (
      STRING_KEYS.has(key) &&
      typeof value === "string" &&
      isSafeValue(key, value)
    ) {
      Object.assign(out, { [key]: value });
    }
  }
  return out;
}
