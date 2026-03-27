"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

type WorkGateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WorkGateModal({ open, onClose }: WorkGateModalProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) primaryRef.current?.focus();
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="work-gate-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className="work-gate-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={s.workGateTitle}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <p className="work-gate-heading">{s.workGateTitle}</p>
        <div className="work-gate-actions">
          <button
            ref={primaryRef}
            className="button button-primary"
            onClick={() => {
              onClose();
              router.push("/work");
            }}
          >
            {s.workGateLetMeSee}
          </button>
          <button
            className="button button-ghost"
            onClick={() => {
              onClose();
              router.push("/contact");
            }}
          >
            {s.workGateConfident}
          </button>
        </div>
      </div>
    </div>
  );
}
