"use client";

import { useEffect, useId, useRef } from "react";
import { preventOrphan } from "@/i18n/typography";

const EMAIL = "itsalefsofit@gmail.com";

type StoreNoticeModalProps = {
  open: boolean;
  isHebrew: boolean;
  onClose: () => void;
};

export function StoreNoticeModal({ open, isHebrew, onClose }: StoreNoticeModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const message = isHebrew
    ? "אני עובד על קולקציות נוספות ושיפור איכות המוצרים,\nמוזמנים לשלוח לי הודעה במייל"
    : "I'm working on more collections and improving product quality.\nFeel free to send me an email.";
  const mailLabel = isHebrew ? "שלחו לי מייל" : "Email me";
  const closeLabel = isHebrew ? "סגור" : "Close";

  return (
    <div className="work-gate-backdrop" role="presentation" onClick={onClose}>
      <div
        className="work-gate-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={isHebrew ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <p id={titleId} className="work-gate-heading" style={{ whiteSpace: "pre-line", fontWeight: 600 }}>
          {preventOrphan(message)}
        </p>
        <div className="work-gate-actions">
          <a className="button button-primary" href={`mailto:${EMAIL}`}>
            {mailLabel}
            <span aria-hidden> · </span>
            {EMAIL}
          </a>
          <button ref={closeBtnRef} type="button" className="button button-ghost" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
