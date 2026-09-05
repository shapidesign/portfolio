"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { About } from "./About";
import { Fade } from "./Fade";
import { FacesShowcase } from "./FacesShowcase";
import { GlyphGrid } from "./GlyphGrid";
import { Header } from "./Header";
import { Tester } from "./Tester";
import { getFace, type FaceId } from "./faces";

export function KibbutzType({ settings }: { settings: KibbutzTypeSettings }) {
  // Central specimen state — the tester writes it, every section reads it.
  const [text, setText] = useState(settings.testerDefaultText);
  const [fontSize, setFontSize] = useState(settings.testerDefaultFontSize);
  const [faceId, setFaceId] = useState<FaceId>("dan");
  const [alternatesEnabled, setAlternatesEnabled] = useState(false);
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

  const colorVariables = {
    "--kt-cream": settings.colorCream,
    "--kt-navy": settings.colorNavy,
    "--kt-green": settings.colorGreen,
    "--kt-orange": settings.colorOrange,
  } as CSSProperties;

  return (
    <div
      className="kt"
      dir="rtl"
      lang="he"
      data-alternates={alternatesEnabled ? "on" : "off"}
      style={colorVariables}
    >
      <Header face={face} settings={settings} />
      <main>
        <Fade>
          <Tester
            text={text}
            fontSize={fontSize}
            face={face}
            settings={settings}
            alternatesEnabled={alternatesEnabled}
            onText={setText}
            onFontSize={setFontSize}
            onFace={setFaceId}
            onAlternates={setAlternatesEnabled}
          />
        </Fade>
        <Fade>
          <FacesShowcase face={face} settings={settings} onFace={setFaceId} />
        </Fade>
        <Fade>
          <GlyphGrid face={face} settings={settings} onFace={setFaceId} />
        </Fade>
        <Fade>
          <About settings={settings} />
        </Fade>
      </main>
      <footer className="kt-wrap kt-footer">
        <span>{settings.footerCredit}</span>
        <span>{settings.footerTagline}</span>
      </footer>
    </div>
  );
}
