"use client";

import { FormEvent, useState } from "react";

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
      {status === "success" && (
        <p className="form-status form-status-success" role="status">
          Thanks for your message. I will get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="form-status form-status-error" role="status">
          Something went wrong. Please try again or email shapidesigns@gmail.com directly.
        </p>
      )}

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

        <button className="button button-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
      </form>
    </>
  );
}
