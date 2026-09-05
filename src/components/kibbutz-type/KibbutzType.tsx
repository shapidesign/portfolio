"use client";

import { useEffect, useState } from "react";
import { About } from "./About";
import { Fade } from "./Fade";
import { FacesShowcase } from "./FacesShowcase";
import { GlyphGrid } from "./GlyphGrid";
import { Header } from "./Header";
import { Tester } from "./Tester";
import { getFace, type FaceId } from "./faces";

export function KibbutzType() {
  // Central specimen state — the tester writes it, every section reads it.
  const [text, setText] = useState("שמונים שנה לחצרים");
  const [fontSize, setFontSize] = useState(72);
  const [faceId, setFaceId] = useState<FaceId>("dan");
  const [alternatesEnabled, setAlternatesEnabled] = useState(false);
  const face = getFace(faceId);

  // Hide global header/footer while mounted (see kibbutz-type.css).
  useEffect(() => {
    document.body.classList.add("kibbutz-type");
    return () => document.body.classList.remove("kibbutz-type");
  }, []);

  return (
    <div className="kt" dir="rtl" lang="he" data-alternates={alternatesEnabled ? "on" : "off"}>
      <Header face={face} />
      <main>
        <Fade>
          <Tester
            text={text}
            fontSize={fontSize}
            face={face}
            alternatesEnabled={alternatesEnabled}
            onText={setText}
            onFontSize={setFontSize}
            onFace={setFaceId}
            onAlternates={setAlternatesEnabled}
          />
        </Fade>
        <Fade>
          <FacesShowcase face={face} onFace={setFaceId} />
        </Fade>
        <Fade>
          <GlyphGrid face={face} onFace={setFaceId} />
        </Fade>
        <Fade>
          <About />
        </Fade>
      </main>
      <footer className="kt-wrap kt-footer">
        <span>עיצוב: יהונתן שפירא</span>
        <span>Kibbutz Type · Hatzerim 80</span>
      </footer>
    </div>
  );
}
