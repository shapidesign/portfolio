"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { preventOrphan } from "@/i18n/typography";

type ContactDrawerProps = {
  open: boolean;
  isHebrew: boolean;
  onClose: () => void;
};

const STRINGS = {
  en: {
    eyebrow: "Contact",
    title: "Send a note",
    intro: "Send a brief, a question, or a quick hello. I read every message.",
    emailLabel: "Email",
    email: "itsalefsofit@gmail.com",
    linkedinLabel: "LinkedIn",
    linkedin: "linkedin.com/in/yehonatan-shapira",
    cv: "Download CV",
    closeAria: "Close",
  },
  he: {
    eyebrow: "יצירת קשר",
    title: "אפשר לכתוב לי",
    intro: "בריף, שאלה או שלום קצר — אני קורא כל הודעה.",
    emailLabel: "אימייל",
    email: "itsalefsofit@gmail.com",
    linkedinLabel: "לינקדאין",
    linkedin: "linkedin.com/in/yehonatan-shapira",
    cv: "הורדת קורות חיים",
    closeAria: "סגור",
  },
} as const;

export function ContactDrawer({ open, isHebrew, onClose }: ContactDrawerProps) {
  const t = isHebrew ? STRINGS.he : STRINGS.en;

  if (!open) return null;

  return (
    <aside
      className="solar-drawer solar-drawer-contact is-open"
      style={{ ["--drawer-accent" as string]: "#66d9ef" }}
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
        <h2 className="solar-drawer-title">{preventOrphan(t.title)}</h2>
        <p className="solar-drawer-descriptor">{preventOrphan(t.intro)}</p>

        <div className="solar-drawer-contact-form">
          <ContactForm />
        </div>

        <div className="solar-drawer-grid">
          <a className="solar-drawer-card solar-drawer-card-link" href={`mailto:${t.email}`}>
            <span className="solar-drawer-card-label">{preventOrphan(t.emailLabel)}</span>
            <p>{t.email}</p>
          </a>
          <a
            className="solar-drawer-card solar-drawer-card-link"
            href={`https://${t.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="solar-drawer-card-label">{preventOrphan(t.linkedinLabel)}</span>
            <p>{t.linkedin}</p>
          </a>
        </div>

        <div className="solar-drawer-cta-row">
          <a
            className="solar-drawer-cta"
            href="/assets/YehonatanShapira-CV2026.pdf"
            download
          >
            {preventOrphan(t.cv)} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
