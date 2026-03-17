"use client";

import { FormEvent, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FormStatus = "idle" | "sending" | "success" | "error";

// Fan-shaped upward burst — deterministic (no Math.random) for SSR safety
const PARTICLES = [
  { id: 0, x:   0, y: -74, color: "#e10600", size: 8,  round: false },
  { id: 1, x:  30, y: -66, color: "#f5cf00", size: 7,  round: true  },
  { id: 2, x:  58, y: -44, color: "#0096db", size: 6,  round: false },
  { id: 3, x:  70, y:  -6, color: "#009b4c", size: 7,  round: true  },
  { id: 4, x: -30, y: -66, color: "#f5cf00", size: 7,  round: false },
  { id: 5, x: -58, y: -44, color: "#e10600", size: 6,  round: true  },
  { id: 6, x: -70, y:  -6, color: "#0096db", size: 8,  round: false },
  { id: 7, x:  14, y: -62, color: "#009b4c", size: 5,  round: true  },
  { id: 8, x: -14, y: -62, color: "#f5cf00", size: 5,  round: false },
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
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setBurstKey((k) => k + 1);
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            key="success"
            className="form-status form-status-success"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            Thanks for your message. I will get back to you soon.
          </motion.p>
        )}
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
      </AnimatePresence>

      <form className="contact-form" method="POST" aria-label="Contact form" onSubmit={handleSubmit}>
        <input type="hidden" name="_subject" value="New portfolio inquiry from yehonatanshapira.com" />

        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required autoComplete="name" />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={6} required />

        <label className="sr-only" htmlFor="website">
          Website
        </label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" className="hp-field" />

        <div className="form-btn-wrap">
          <button
            className={`button button-primary form-submit-btn ${status === "success" ? "form-submit-success" : ""} ${status === "error" ? "form-submit-error" : ""}`}
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

          <AnimatePresence>
            {status === "success" && !reducedMotion && (
              <div key={burstKey} className="form-burst" aria-hidden>
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
                    animate={{ opacity: 0, x: p.x, y: p.y, scale: 0, rotate: 200 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: p.id * 0.025 }}
                  />
                ))}

                <motion.div
                  className="form-burst-envelope"
                  initial={{ opacity: 0, scale: 0.4, y: 4, x: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.4, 1.15, 1.05, 0.7],
                    y: [4, -4, -68],
                    x: [0, 2, 14],
                    rotate: [0, 0, -9],
                  }}
                  transition={{ duration: 0.95, ease: "easeOut", times: [0, 0.18, 0.55, 1] }}
                >
                  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" aria-hidden>
                    <rect x="1" y="1" width="32" height="26" rx="3" fill="#f5cf00" />
                    <polyline points="1,1 17,16 33,1" fill="none" stroke="#07080c" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="1" y1="27" x2="13" y2="15" stroke="#07080c" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="33" y1="27" x2="21" y2="15" stroke="#07080c" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </>
  );
}
