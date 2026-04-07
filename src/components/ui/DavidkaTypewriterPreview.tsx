"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK_TEXT =
  "בראשית ברא אלהים את השמים ואת הארץ. והארץ היתה תהו ובהו וחשך על פני תהום ורוח אלהים מרחפת על פני המים. ויאמר אלהים יהי אור ויהי אור. וירא אלהים את האור כי טוב ויבדל אלהים בין האור ובין החשך. ויקרא אלהים לאור יום ולחשך קרא לילה ויהי ערב ויהי בקר יום אחד. ויאמר אלהים יהי רקיע בתוך המים ויהי מבדיל בין מים למים. ויעש אלהים את הרקיע ויבדל בין המים אשר מתחת לרקיע ובין המים אשר מעל לרקיע ויהי כן.";

const WIKI_API = "https://he.wikipedia.org/api/rest_v1/page/random/summary";

const CHAR_DELAY_MS = 42;
const HOLD_MS = 2200;
const FADE_MS = 700;

async function fetchWikiText(): Promise<string | null> {
  try {
    const res = await fetch(WIKI_API);
    const data = await res.json();
    if (typeof data.extract === "string" && data.extract.length > 0) {
      return data.extract.slice(0, 800);
    }
  } catch { /* keep fallback */ }
  return null;
}

function wait(ms: number, signal: { aborted: boolean }): Promise<void> {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    // poll abort every 50ms
    const poll = setInterval(() => {
      if (signal.aborted) { clearTimeout(id); clearInterval(poll); resolve(); }
    }, 50);
    // clear poll when timer fires naturally
    setTimeout(() => clearInterval(poll), ms + 10);
  });
}

export function DavidkaTypewriterPreview() {
  const [displayText, setDisplayText] = useState("");
  const [fading, setFading] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef({ aborted: false });

  useEffect(() => {
    const signal = { aborted: false };
    abortRef.current = signal;

    function isBoxFull(): boolean {
      const el = frontRef.current;
      if (!el) return false;
      return el.scrollHeight > el.clientHeight + 4;
    }

    async function typeText(text: string): Promise<void> {
      let idx = 0;
      return new Promise((resolve) => {
        let lastTime = 0;
        let raf = 0;

        function step(now: number) {
          if (signal.aborted) { resolve(); return; }
          if (now - lastTime >= CHAR_DELAY_MS) {
            lastTime = now;
            idx++;
            setDisplayText(text.slice(0, idx));
            if (isBoxFull() || idx >= text.length) {
              resolve();
              return;
            }
          }
          raf = requestAnimationFrame(step);
        }

        raf = requestAnimationFrame(step);
        // cleanup on abort
        const check = setInterval(() => {
          if (signal.aborted) { cancelAnimationFrame(raf); clearInterval(check); resolve(); }
        }, 100);
        // clear check when typing ends naturally — wrap resolve
        const origResolve = resolve;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (resolve as any) = () => { clearInterval(check); cancelAnimationFrame(raf); origResolve(); };
      });
    }

    async function runCycle(): Promise<void> {
      if (signal.aborted) return;

      // fetch new text before showing anything
      const fetched = await fetchWikiText();
      const text = fetched ?? FALLBACK_TEXT;

      if (signal.aborted) return;

      // reset display (still faded out from previous cycle, or first run)
      setDisplayText("");

      // brief tick so React flushes the empty state before we start typing
      await new Promise((r) => setTimeout(r, 50));
      if (signal.aborted) return;

      // reveal
      setFading(false);

      // type characters one by one
      await typeText(text);
      if (signal.aborted) return;

      // hold so reader can see the completed text
      await wait(HOLD_MS, signal);
      if (signal.aborted) return;

      // fade out
      setFading(true);
      await wait(FADE_MS + 100, signal); // slightly longer than CSS transition
      if (signal.aborted) return;

      // loop
      runCycle();
    }

    // start with a short delay so the card finishes mounting
    const boot = setTimeout(() => { if (!signal.aborted) runCycle(); }, 200);

    return () => {
      signal.aborted = true;
      clearTimeout(boot);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="davidka-typewriter-preview"
      aria-hidden="true"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <div className="davidka-tw-back">{displayText}</div>
      <div ref={frontRef} className="davidka-tw-front">{displayText}</div>
    </div>
  );
}
