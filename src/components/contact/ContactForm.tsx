"use client";

import { FormEvent, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FormStatus = "idle" | "sending" | "success" | "error";

// Full-circle burst — 20 particles, deterministic for SSR safety
const PARTICLES = [
  { id:  0, x:   0, y: -90, color: "#e10600", size: 9,  round: false },
  { id:  1, x:  44, y: -78, color: "#f5cf00", size: 7,  round: true  },
  { id:  2, x:  78, y: -44, color: "#0096db", size: 8,  round: false },
  { id:  3, x:  90, y:   0, color: "#009b4c", size: 6,  round: true  },
  { id:  4, x:  78, y:  44, color: "#f5cf00", size: 7,  round: false },
  { id:  5, x:  44, y:  78, color: "#e10600", size: 8,  round: true  },
  { id:  6, x:   0, y:  90, color: "#0096db", size: 6,  round: false },
  { id:  7, x: -44, y:  78, color: "#f5cf00", size: 9,  round: true  },
  { id:  8, x: -78, y:  44, color: "#e10600", size: 7,  round: false },
  { id:  9, x: -90, y:   0, color: "#0096db", size: 8,  round: true  },
  { id: 10, x: -78, y: -44, color: "#009b4c", size: 6,  round: false },
  { id: 11, x: -44, y: -78, color: "#f5cf00", size: 7,  round: true  },
  { id: 12, x:  22, y: -55, color: "#0096db", size: 5,  round: false },
  { id: 13, x: -22, y: -55, color: "#e10600", size: 5,  round: true  },
  { id: 14, x:  55, y: -22, color: "#f5cf00", size: 5,  round: false },
  { id: 15, x: -55, y: -22, color: "#009b4c", size: 5,  round: true  },
  { id: 16, x:  55, y:  22, color: "#e10600", size: 4,  round: false },
  { id: 17, x: -55, y:  22, color: "#f5cf00", size: 4,  round: true  },
  { id: 18, x:  22, y:  55, color: "#0096db", size: 4,  round: false },
  { id: 19, x: -22, y:  55, color: "#009b4c", size: 4,  round: true  },
];

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [burstKey, setBurstKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

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
                <motion.span
                  key={p.id}
                  className="form-burst-particle"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    borderRadius: p.round ? "50%" : "2px",
                  }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: p.x * 1.4, y: p.y * 1.4, scale: 0, rotate: 360 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: p.id * 0.018 }}
                />
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
              <circle cx="26" cy="26" r="25" fill="color-mix(in srgb, #f5cf00 22%, transparent)" stroke="#f5cf00" strokeWidth="1.5" />
              <motion.polyline
                points="14,26 22,34 38,18"
                fill="none"
                stroke="#f5cf00"
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
            Message sent!
          </motion.h3>

          <motion.p
            className="form-sent-copy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4, ease: "easeOut" }}
          >
            Thanks for reaching out. I&apos;ll get back to you soon.
          </motion.p>

          <motion.button
            className="button button-ghost form-sent-reset"
            onClick={() => setStatus("idle")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            type="button"
          >
            Send another
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
              Something went wrong. Please try again or email shapidesigns@gmail.com directly.
            </motion.p>
          )}

          <form className="contact-form" method="POST" aria-label="Contact form" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="New portfolio inquiry from yehonatanshapira.com" />

            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required autoComplete="name" />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />

            <label htmlFor="message">Message</label>
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
                  <span className="form-spinner" aria-label="Sending">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Send message"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
