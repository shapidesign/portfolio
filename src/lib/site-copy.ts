/**
 * Site-wide editable copy (home hero, main CTAs, About popup + page).
 *
 * ponytail: stored as one reserved row (slug "__site__") in the existing
 * project_overrides table — no new table/API. Upgrade path: dedicated
 * site_settings table if this outgrows a single JSON blob.
 *
 * Client-safe (no server-only imports) so the admin editor and the save API
 * share the same field list and sanitizer.
 */

export const SITE_SLUG = "__site__";

export type SiteCopy = Record<string, string>;

export type SiteCopyFieldPair = {
  label: string;
  en: string;
  he: string;
  multiline?: boolean;
  /** Groups fields in the admin editor (e.g. popup vs page). */
  section?: string;
};

export const SITE_COPY_FIELDS: SiteCopyFieldPair[] = [
  { label: "Home — Eyebrow", en: "homeEyebrow", he: "heHomeEyebrow" },
  { label: "Home — Headline", en: "homeTitle", he: "heHomeTitle" },
  { label: "Home — Intro", en: "homeIntro", he: "heHomeIntro", multiline: true },
  { label: "CTA — Start the ride", en: "homeCtaStart", he: "heHomeCtaStart" },
  { label: "CTA — About", en: "homeCtaAbout", he: "heHomeCtaAbout" },
  { label: "CTA — List view", en: "homeCtaList", he: "heHomeCtaList" },
];

/** About popup (home) and the /about page. Same storage row as site copy. */
export const ABOUT_COPY_FIELDS: SiteCopyFieldPair[] = [
  { section: "Popup", label: "Eyebrow", en: "aboutPopupEyebrow", he: "heAboutPopupEyebrow" },
  { section: "Popup", label: "Name", en: "aboutPopupName", he: "heAboutPopupName" },
  {
    section: "Popup",
    label: "Descriptor",
    en: "aboutPopupDescriptor",
    he: "heAboutPopupDescriptor",
    multiline: true,
  },
  { section: "Popup", label: "Class label", en: "aboutPopupClassLabel", he: "heAboutPopupClassLabel" },
  { section: "Popup", label: "Class", en: "aboutPopupClass", he: "heAboutPopupClass" },
  { section: "Popup", label: "Origin label", en: "aboutPopupOriginLabel", he: "heAboutPopupOriginLabel" },
  { section: "Popup", label: "Origin", en: "aboutPopupOrigin", he: "heAboutPopupOrigin" },
  { section: "Popup", label: "Status label", en: "aboutPopupStatusLabel", he: "heAboutPopupStatusLabel" },
  { section: "Popup", label: "Status", en: "aboutPopupStatus", he: "heAboutPopupStatus" },
  { section: "Popup", label: "Bio 1", en: "aboutPopupBio1", he: "heAboutPopupBio1", multiline: true },
  { section: "Popup", label: "Bio 2", en: "aboutPopupBio2", he: "heAboutPopupBio2", multiline: true },
  { section: "Page", label: "Name", en: "aboutName", he: "heAboutName" },
  { section: "Page", label: "Title", en: "aboutTitle", he: "heAboutTitle" },
  { section: "Page", label: "Lead", en: "aboutLead", he: "heAboutLead", multiline: true },
  { section: "Page", label: "Who I am — heading", en: "aboutWhoHeading", he: "heAboutWhoHeading" },
  { section: "Page", label: "Who I am — body", en: "aboutWhoBody", he: "heAboutWhoBody", multiline: true },
  { section: "Page", label: "How I work — heading", en: "aboutHowHeading", he: "heAboutHowHeading" },
  { section: "Page", label: "How I work — body", en: "aboutHowBody", he: "heAboutHowBody", multiline: true },
  { section: "Page", label: "Now — heading", en: "aboutNowHeading", he: "heAboutNowHeading" },
  { section: "Page", label: "Now — body", en: "aboutNowBody", he: "heAboutNowBody", multiline: true },
  { section: "Page", label: "Download CV", en: "aboutDownloadCV", he: "heAboutDownloadCV" },
  { section: "Page", label: "Contact me", en: "aboutContactMe", he: "heAboutContactMe" },
];

/** Canonical default copy; components fall back to these when unset. */
export const SITE_COPY_DEFAULTS: SiteCopy = {
  homeEyebrow: "Selected work, in orbit",
  heHomeEyebrow: "עבודות נבחרות במסלול",
  homeTitle: "time to start exploring",
  heHomeTitle: "הגיע הזמן להתחיל לחקור",
  homeIntro:
    "Take the guided ride, tap a planet to open a project, or switch to the list when you want the quick version.",
  heHomeIntro:
    "אפשר לצאת למסלול מודרך, לפתוח פרויקט דרך אחד הכוכבים, או לעבור לרשימה כשבא לך לראות הכול מהר.",
  homeCtaStart: "Start the ride",
  heHomeCtaStart: "להתחיל את המסלול",
  homeCtaAbout: "About",
  heHomeCtaAbout: "אודות",
  homeCtaList: "List View",
  heHomeCtaList: "רשימה",
  aboutPopupEyebrow: "Pilot Profile",
  heAboutPopupEyebrow: "פרופיל טייס",
  aboutPopupName: "Yehonatan Shapira",
  heAboutPopupName: "יהונתן שפירא",
  aboutPopupDescriptor:
    "Visual designer working at the intersection of brand, type, and digital craft.",
  heAboutPopupDescriptor: "מעצב חזותי שעובד בין מותג, טיפוגרפיה ומלאכה דיגיטלית.",
  aboutPopupClassLabel: "Class",
  heAboutPopupClassLabel: "סוג",
  aboutPopupClass: "Visual Designer",
  heAboutPopupClass: "מעצב חזותי",
  aboutPopupOriginLabel: "Origin",
  heAboutPopupOriginLabel: "מוצא",
  aboutPopupOrigin: "Earth · Israel",
  heAboutPopupOrigin: "כדור הארץ · ישראל",
  aboutPopupStatusLabel: "Status",
  heAboutPopupStatusLabel: "סטטוס",
  aboutPopupStatus: "Available for thoughtful briefs",
  heAboutPopupStatus: "פנוי לבריפים מעניינים",
  aboutPopupBio1:
    "I build visual systems, stories, and identities with care. Curiosity keeps the work moving: asking better questions, testing early, and shaping clear solutions.",
  heAboutPopupBio1:
    "אני בונה מערכות חזותיות, סיפורים וזהויות עם מחשבה. הסקרנות מזיזה את העבודה קדימה: לשאול טוב יותר, לבדוק מוקדם, ולדייק את הפתרון.",
  aboutPopupBio2:
    "The practice moves between branding, typography, packaging, interfaces, and creative code. The medium follows the brief, not the other way around.",
  heAboutPopupBio2:
    "העבודה נעה בין מיתוג, טיפוגרפיה, אריזה, ממשקים וקוד יצירתי. הבריף בוחר את המדיום, לא להפך.",
  aboutName: "Yehonatan Shapira",
  heAboutName: "יהונתן שפירא",
  aboutTitle: "About",
  heAboutTitle: "אודות",
  aboutLead: "Good design starts with the right question, not the right aesthetic.",
  heAboutLead: "עיצוב טוב מתחיל בשאלה הנכונה, לא באסתטיקה הנכונה.",
  aboutWhoHeading: "Who I am",
  heAboutWhoHeading: "מי אני",
  aboutWhoBody:
    "I am Yehonatan Shapira, a visual communication designer based in Jaffa. I build identity systems and digital experiences that balance clarity with personality.",
  heAboutWhoBody:
    "אני יהונתן שפירא, מעצב תקשורת חזותית מיפו. אני בונה זהויות מותג וחוויות דיגיטליות שמאזנות בין בהירות לבין אופי.",
  aboutHowHeading: "How I work",
  heAboutHowHeading: "איך אני עובד",
  aboutHowBody:
    "My process starts with the real constraint, not the visual trend. I map the problem, set hierarchy, and design the system so every choice supports the message.",
  heAboutHowBody:
    "התהליך שלי מתחיל מהאילוץ האמיתי ולא מהטרנד החזותי. אני ממפה את הבעיה, בונה היררכיה, ומעצב מערכת שבה כל בחירה משרתת את המסר.",
  aboutNowHeading: "What I am doing now",
  heAboutNowHeading: "מה אני עושה עכשיו",
  aboutNowBody:
    "Right now I am focused on branding, product interfaces, and experimental typography projects that connect strategic thinking with strong visual execution.",
  heAboutNowBody:
    "כיום אני מתמקד בפרויקטים של מיתוג, ממשקים דיגיטליים וטיפוגרפיה ניסיונית, שמחברים חשיבה אסטרטגית עם ביצוע חזותי מדויק.",
  aboutDownloadCV: "Download CV",
  heAboutDownloadCV: "הורדת קורות חיים",
  aboutContactMe: "Contact me",
  heAboutContactMe: "צור קשר",
};

const SITE_COPY_KEYS = new Set(
  [...SITE_COPY_FIELDS, ...ABOUT_COPY_FIELDS].flatMap((f) => [f.en, f.he]),
);

/** Stored value wins; blank falls back to the committed default. */
export function siteCopyText(
  siteCopy: SiteCopy | undefined,
  isHebrew: boolean,
  en: string,
  he: string,
): string {
  const key = isHebrew ? he : en;
  return siteCopy?.[key]?.trim() || SITE_COPY_DEFAULTS[key] || "";
}

/** Keep only known site-copy keys with string values. */
export function sanitizeSiteCopy(input: Record<string, unknown>): SiteCopy {
  const out: SiteCopy = {};
  for (const [key, value] of Object.entries(input)) {
    if (SITE_COPY_KEYS.has(key) && typeof value === "string") out[key] = value;
  }
  return out;
}
