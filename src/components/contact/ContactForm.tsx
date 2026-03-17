"use client";

import { FormEvent, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("website") ?? "").trim().length > 0) {
      setStatus("success");
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
      </form>
    </>
  );
}
