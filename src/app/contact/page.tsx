"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

export default function ContactPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  return (
    <main className="section content-wrap">
      <Reveal>
        <h1>{s.contactTitle}</h1>
        <p className="lead">{s.contactLead}</p>
        <p className="subtitle">
          {s.contactSubtitle}{" "}
          <a href="mailto:shapidesigns@gmail.com">shapidesigns@gmail.com</a>{" "}
          <a href="/assets/YehonatanShapira-CV2026.pdf" download>
            {s.contactDownloadCV}
          </a>
          .
        </p>
      </Reveal>

      <Reveal>
        <ContactForm />
      </Reveal>
    </main>
  );
}
