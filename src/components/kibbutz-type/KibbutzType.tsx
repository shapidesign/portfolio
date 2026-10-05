"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { About } from "./About";
import { Fade } from "./Fade";
import { FacesShowcase } from "./FacesShowcase";
import { GlyphGrid } from "./GlyphGrid";
import { Header } from "./Header";
import { SpecimenText } from "./SpecimenText";
import { Tester } from "./Tester";
import { getFace, type FaceId } from "./faces";

export function KibbutzType({ settings }: { settings: KibbutzTypeSettings }) {
  // Central specimen state — the tester writes it, every section reads it.
  const [text, setText] = useState(settings.testerDefaultText);
  // ponytail: SSR + first paint share one size so hydration matches; phones
  // shrink after mount.
  const [fontSize, setFontSize] = useState(settings.testerDefaultFontSize);
  const [width, setWidth] = useState(500);
  const [faceId, setFaceId] = useState<FaceId>("dan");
  const [alternatesEnabled, setAlternatesEnabled] = useState(false);
  const [gateDismissed, setGateDismissed] = useState(false);
  const router = useRouter();
  const titleId = useId();
  const leaveRef = useRef<HTMLButtonElement>(null);
  const face = getFace(faceId);

  // Hide global header/footer while mounted (see kibbutz-type.css).
  useEffect(() => {
    document.body.classList.add("kibbutz-type");
    document.body.style.setProperty("--kt-page-bg", settings.colorCream);
    return () => {
      document.body.classList.remove("kibbutz-type");
      document.body.style.removeProperty("--kt-page-bg");
    };
  }, [settings.colorCream]);

  // The desktop gate is CSS-controlled before hydration; only the phone's
  // smaller default tester size needs a post-mount adjustment.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 600px)").matches) return;
    const frame = window.requestAnimationFrame(() => setFontSize(60));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (
      !gateDismissed &&
      window.matchMedia("(min-width: 768px) and (pointer: fine)").matches
    ) {
      leaveRef.current?.focus();
    }
  }, [gateDismissed]);

  const colorVariables = {
    "--kt-cream": settings.colorCream,
    "--kt-navy": settings.colorNavy,
    "--kt-green": settings.colorGreen,
    "--kt-orange": settings.colorOrange,
    "--kt-wdth": String(width),
  } as CSSProperties;

  return (
    <div
      className="kt"
      dir="rtl"
      lang="he"
      data-alternates={alternatesEnabled ? "on" : "off"}
      data-desktop-gate={gateDismissed ? "dismissed" : "pending"}
      style={colorVariables}
    >
      <div
        className="kt-desktop-gate"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(e) => {
          if (e.key === "Escape") router.push("/");
        }}
      >
        <p id={titleId} className="kt-desktop-gate-copy">
          עדיף לפתוח את זה בטלפון. את/ה בטוח שתרצה/י לפתוח את זה במחשב.
        </p>
        <div className="kt-desktop-gate-actions">
          <button type="button" onClick={() => setGateDismissed(true)}>
            כן, אני עקשן ואני רוצה במחשב
          </button>
          <button
            ref={leaveRef}
            type="button"
            className="kt-desktop-gate-leave"
            onClick={() => router.push("/")}
          >
            לא, אתה צודק ועדיף בטלפון
          </button>
        </div>
      </div>
      <div className="kt-page-content">
        <Header face={face} settings={settings} />
        <main>
          <section className="kt-promo kt-wrap">
            <video
              controls
              playsInline
              preload="metadata"
              src="/videos/hatzerim-80-type-promo.mp4"
              aria-label="פרומו קיבוץ טייפ"
            />
          </section>
          <Fade>
            <Tester
              text={text}
              fontSize={fontSize}
              width={width}
              face={face}
              settings={settings}
              alternatesEnabled={alternatesEnabled}
              onText={setText}
              onFontSize={setFontSize}
              onWidth={setWidth}
              onFace={setFaceId}
              onAlternates={setAlternatesEnabled}
            />
          </Fade>
          <Fade>
            <FacesShowcase settings={settings} />
          </Fade>
          <Fade>
            <GlyphGrid face={face} settings={settings} onFace={setFaceId} />
          </Fade>
          <Fade>
            <About settings={settings} />
          </Fade>
        </main>
        <footer className="kt-wrap kt-footer">
          <SpecimenText>{settings.footerCredit}</SpecimenText>
          <SpecimenText>{settings.footerTagline}</SpecimenText>
        </footer>
      </div>
    </div>
  );
}
