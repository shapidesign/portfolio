"use client";

import { preventOrphan } from "@/i18n/typography";

type AboutDrawerProps = {
  open: boolean;
  isHebrew: boolean;
  onClose: () => void;
};

const STRINGS = {
  en: {
    eyebrow: "Pilot Profile",
    name: "Yehonatan Shapira",
    descriptor: "Visual designer working at the intersection of brand, type, and digital craft.",
    classLabel: "Class",
    classValue: "Visual Designer",
    originLabel: "Origin",
    originValue: "Earth · Israel",
    statusLabel: "Status",
    statusValue: "Available for thoughtful briefs",
    bio1:
      "I build visual systems, stories, and identities with care. Curiosity keeps the work moving: asking better questions, testing early, and shaping clear solutions.",
    bio2:
      "The practice moves between branding, typography, packaging, interfaces, and creative code. The medium follows the brief, not the other way around.",
    closeAria: "Close",
  },
  he: {
    eyebrow: "פרופיל טייס",
    name: "יהונתן שפירא",
    descriptor: "מעצב חזותי שעובד בין מותג, טיפוגרפיה ומלאכה דיגיטלית.",
    classLabel: "סוג",
    classValue: "מעצב חזותי",
    originLabel: "מוצא",
    originValue: "כדור הארץ · ישראל",
    statusLabel: "סטטוס",
    statusValue: "פנוי לבריפים מעניינים",
    bio1:
      "אני בונה מערכות חזותיות, סיפורים וזהויות עם מחשבה. הסקרנות מזיזה את העבודה קדימה: לשאול טוב יותר, לבדוק מוקדם, ולדייק את הפתרון.",
    bio2:
      "העבודה נעה בין מיתוג, טיפוגרפיה, אריזה, ממשקים וקוד יצירתי. הבריף בוחר את המדיום, לא להפך.",
    closeAria: "סגור",
  },
} as const;

export function AboutDrawer({ open, isHebrew, onClose }: AboutDrawerProps) {
  const t = isHebrew ? STRINGS.he : STRINGS.en;

  if (!open) return null;

  return (
    <aside
      className="solar-drawer solar-drawer-about is-open"
      style={{ ["--drawer-accent" as string]: "#7a56f2" }}
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <header className="solar-drawer-header">
        <div className="solar-drawer-eyebrow">
          <span className="solar-drawer-dot" />
          {preventOrphan(t.eyebrow)}
        </div>
        <button type="button" className="solar-drawer-close" onClick={onClose} aria-label={t.closeAria}>
          <span aria-hidden>×</span>
        </button>
      </header>

      <div className="solar-drawer-body">
        <h2 className="solar-drawer-title">{preventOrphan(t.name)}</h2>
        <p className="solar-drawer-descriptor">{preventOrphan(t.descriptor)}</p>

        <div className="solar-drawer-grid">
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">{preventOrphan(t.classLabel)}</span>
            <p>{preventOrphan(t.classValue)}</p>
          </section>
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">{preventOrphan(t.originLabel)}</span>
            <p>{preventOrphan(t.originValue)}</p>
          </section>
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">{preventOrphan(t.statusLabel)}</span>
            <p>{preventOrphan(t.statusValue)}</p>
          </section>
        </div>

        <div className="solar-drawer-prose">
          <p>{preventOrphan(t.bio1)}</p>
          <p>{preventOrphan(t.bio2)}</p>
        </div>
      </div>
    </aside>
  );
}
