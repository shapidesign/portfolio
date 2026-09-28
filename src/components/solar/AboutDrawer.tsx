"use client";

import { preventOrphan } from "@/i18n/typography";
import { siteCopyText, type SiteCopy } from "@/lib/site-copy";

type AboutDrawerProps = {
  open: boolean;
  isHebrew: boolean;
  siteCopy?: SiteCopy;
  onClose: () => void;
};

export function AboutDrawer({ open, isHebrew, siteCopy, onClose }: AboutDrawerProps) {
  const text = (en: string, he: string) => siteCopyText(siteCopy, isHebrew, en, he);

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
          {preventOrphan(text("aboutPopupEyebrow", "heAboutPopupEyebrow"))}
        </div>
        <button
          type="button"
          className="solar-drawer-close"
          onClick={onClose}
          aria-label={isHebrew ? "סגור" : "Close"}
        >
          <span aria-hidden>×</span>
        </button>
      </header>

      <div className="solar-drawer-body">
        <h2 className="solar-drawer-title">{preventOrphan(text("aboutPopupName", "heAboutPopupName"))}</h2>
        <p className="solar-drawer-descriptor">
          {preventOrphan(text("aboutPopupDescriptor", "heAboutPopupDescriptor"))}
        </p>

        <div className="solar-drawer-grid">
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">
              {preventOrphan(text("aboutPopupClassLabel", "heAboutPopupClassLabel"))}
            </span>
            <p>{preventOrphan(text("aboutPopupClass", "heAboutPopupClass"))}</p>
          </section>
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">
              {preventOrphan(text("aboutPopupOriginLabel", "heAboutPopupOriginLabel"))}
            </span>
            <p>{preventOrphan(text("aboutPopupOrigin", "heAboutPopupOrigin"))}</p>
          </section>
          <section className="solar-drawer-card">
            <span className="solar-drawer-card-label">
              {preventOrphan(text("aboutPopupStatusLabel", "heAboutPopupStatusLabel"))}
            </span>
            <p>{preventOrphan(text("aboutPopupStatus", "heAboutPopupStatus"))}</p>
          </section>
        </div>

        <div className="solar-drawer-prose">
          <p>{preventOrphan(text("aboutPopupBio1", "heAboutPopupBio1"))}</p>
          <p>{preventOrphan(text("aboutPopupBio2", "heAboutPopupBio2"))}</p>
        </div>
      </div>
    </aside>
  );
}
