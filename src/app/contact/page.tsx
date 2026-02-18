import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="section content-wrap">
      <Reveal>
        <h1>Contact</h1>
        <p className="lead">
          If you want to collaborate on branding, digital design, or creative direction, send a message.
        </p>
        <p className="subtitle">
          Or email directly at <a href="mailto:shapidesigns@gmail.com">shapidesigns@gmail.com</a> and{" "}
          <a href="/assets/YehonatanShapira-CV-Sep2025.pdf" download>
            download my CV
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
