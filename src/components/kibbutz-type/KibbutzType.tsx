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
import { WallForm } from "./WallForm";
import { getFace, type FaceId } from "./faces";

type Gate = "ask" | "open";

export function KibbutzType({ settings }: { settings: KibbutzTypeSettings }) {
  // Central specimen state — the tester writes it, every section reads it.
  const [text, setText] = useState(settings.testerDefaultText);
  // ponytail: SSR + first paint share one size so hydration matches; phones
  // shrink after mount.
  const [fontSize, setFontSize] = useState(settings.testerDefaultFontSize);
  const [width, setWidth] = useState(100);
  const [faceId, setFaceId] = useState<FaceId>("dan");
  const [alternatesEnabled, setAlternatesEnabled] = useState(false);
  // Start open so SSR/client HTML match; desktop nag overlays after mount.
  const [gate, setGate] = useState<Gate>("open");
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

  // ponytail: wide + mouse = computer. Phones (coarse or narrow) skip the nag.
  useEffect(() => {
    const isComputer = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    if (isComputer) setGate("ask");
    if (window.matchMedia("(max-width: 600px)").matches) setFontSize(60);
  }, []);

  useEffect(() => {
    if (gate === "ask") leaveRef.current?.focus();
  }, [gate]);

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
      style={colorVariables}
    >
      {gate === "ask" ? (
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
            <button type="button" onClick={() => setGate("open")}>
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
      ) : (
        <>
          <Header face={face} settings={settings} />
          <main>
            <Fade>
              <WallForm settings={settings} />
            </Fade>
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
        </>
      )}
    </div>
  );
}
