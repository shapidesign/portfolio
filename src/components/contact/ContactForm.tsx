"use client";

import { FormEvent, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { STAR_PATH_2D, STAR_VIEWBOX } from "@/components/solar/star-path";

type FormStatus = "idle" | "sending" | "success" | "error";

// Star firework — 20 particles in a full ring, deterministic for SSR safety.
const PARTICLES = [
  { id:  0, x:   0, y: -90, color: "#ffffff", size: 18, rot:  20 },
  { id:  1, x:  44, y: -78, color: "#dac9ff", size: 14, rot: -30 },
  { id:  2, x:  78, y: -44, color: "#a98bff", size: 16, rot:  90 },
  { id:  3, x:  90, y:   0, color: "#9bd9ff", size: 12, rot:  10 },
  { id:  4, x:  78, y:  44, color: "#dac9ff", size: 15, rot: -60 },
  { id:  5, x:  44, y:  78, color: "#7a56f2", size: 16, rot: 120 },
  { id:  6, x:   0, y:  90, color: "#ffffff", size: 12, rot:  45 },
  { id:  7, x: -44, y:  78, color: "#a98bff", size: 18, rot: -90 },
  { id:  8, x: -78, y:  44, color: "#7a56f2", size: 14, rot:  30 },
  { id:  9, x: -90, y:   0, color: "#9bd9ff", size: 16, rot: 200 },
  { id: 10, x: -78, y: -44, color: "#dac9ff", size: 12, rot: -45 },
  { id: 11, x: -44, y: -78, color: "#a98bff", size: 14, rot:  60 },
  { id: 12, x:  22, y: -55, color: "#ffffff", size: 10, rot: -20 },
  { id: 13, x: -22, y: -55, color: "#7a56f2", size: 10, rot:  80 },
  { id: 14, x:  55, y: -22, color: "#a98bff", size: 10, rot:  10 },
  { id: 15, x: -55, y: -22, color: "#9bd9ff", size: 10, rot: -75 },
  { id: 16, x:  55, y:  22, color: "#dac9ff", size:  8, rot:  35 },
  { id: 17, x: -55, y:  22, color: "#a98bff", size:  8, rot: -15 },
  { id: 18, x:  22, y:  55, color: "#ffffff", size:  8, rot: 110 },
  { id: 19, x: -22, y:  55, color: "#9bd9ff", size:  8, rot: -55 },
];

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [burstKey, setBurstKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("website") ?? "").trim().length > 0) {
      setStatus("success");
      setBurstKey((k) => k + 1);
      form.reset();
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/meolqyap", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setBurstKey((k) => k + 1);
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="sent"
          className="form-sent-card"
          role="status"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {!reducedMotion && (
            <div key={burstKey} className="form-burst form-burst-center" aria-hidden>
              {PARTICLES.map((p) => (
                <motion.svg
                  key={p.id}
                  className="form-burst-particle"
                  viewBox={STAR_VIEWBOX}
                  style={{
                    width: p.size,
                    height: p.size,
                    color: p.color,
                    filter: `drop-shadow(0 0 6px ${p.color})`,
                  }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.6, rotate: p.rot }}
                  animate={{ opacity: 0, x: p.x * 1.4, y: p.y * 1.4, scale: 0.2, rotate: p.rot + 540 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: p.id * 0.018 }}
                >
                  <path d={STAR_PATH_2D} fill="currentColor" />
                </motion.svg>
              ))}
            </div>
          )}

          <motion.div
            className="form-sent-icon"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden>
              <circle cx="26" cy="26" r="25" fill="color-mix(in srgb, #22bb66 22%, transparent)" stroke="#22bb66" strokeWidth="1.5" />
              <motion.polyline
                points="14,26 22,34 38,18"
                fill="none"
                stroke="#22bb66"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          <motion.h3
            className="form-sent-heading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
          >
            {s.formSent}
          </motion.h3>

          <motion.p
            className="form-sent-copy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4, ease: "easeOut" }}
          >
            {s.formSentBody}
          </motion.p>

          <motion.button
            className="button button-ghost form-sent-reset"
            onClick={() => setStatus("idle")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            type="button"
          >
            {s.formSendAnother}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          {status === "error" && (
            <motion.p
              key="error"
              className="form-status form-status-error"
              role="status"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {s.formError}
            </motion.p>
          )}

          <form className="contact-form" method="POST" aria-label="Contact form" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="New portfolio inquiry from alefsofit.com" />

            <label htmlFor="name">{s.formName}</label>
            <input id="name" name="name" type="text" required autoComplete="name" />

            <label htmlFor="email">{s.formEmail}</label>
            <input id="email" name="email" type="email" required autoComplete="email" />

            <label htmlFor="message">{s.formMessage}</label>
            <textarea id="message" name="message" rows={6} required />

            <label className="sr-only" htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" className="hp-field" />

            <div className="form-btn-wrap">
              <button
                className={`button button-primary form-submit-btn ${status === "error" ? "form-submit-error" : ""}`}
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <span className="form-spinner" aria-label={s.formSending}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                    {s.formSending}
                  </span>
                ) : (
                  s.formSend
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
