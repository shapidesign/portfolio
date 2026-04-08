"use client";

import { useState } from "react";
import Image from "next/image";

const DEFAULT_TEXT =
  "השימוש בגופנים ממשפחת הסריף, ובפרט בגופן 'דוד', נחשב לסטנדרט המקובל בכתיבה אקדמית ומשפטית בישראל מזה עשרות שנים.";

export function DavidkaEmbed() {
  const [isDavidka, setIsDavidka] = useState(true);
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <div className="davidka-embed">
      {/* Font flip */}
      <button
        type="button"
        className="davidka-flip"
        onClick={() => setIsDavidka((v) => !v)}
        aria-label="Toggle between project logo variants"
      >
        <div className="davidka-flip-stack">
          <Image
            src="/assets/davidka/Davidka-over-David.svg"
            alt="Davidka font"
            width={520}
            height={80}
            sizes="(max-width: 700px) 100vw, 520px"
            className={`davidka-flip-img davidka-flip-img-davidka ${isDavidka ? "active" : ""}`}
          />
          <Image
            src="/assets/davidka/David-over-Davidka.svg"
            alt="David Libre font"
            width={520}
            height={80}
            sizes="(max-width: 700px) 100vw, 520px"
            className={`davidka-flip-img ${!isDavidka ? "active" : ""}`}
          />
        </div>
        <span className="davidka-flip-hint">Click to toggle</span>
      </button>

      {/* Comparison */}
      <div className="davidka-comparison">
        <textarea
          className="davidka-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          dir="rtl"
          placeholder="הקלד טקסט כאן..."
          rows={3}
        />

        <div className="davidka-columns">
          <div className="davidka-col">
            <span className="davidka-col-label">Rubik — regular</span>
            <div className="davidka-col-paper davidka-col-paper--rubik-regular">
              <p dir="rtl">{text}</p>
            </div>
          </div>
          <div className="davidka-col">
            <span className="davidka-col-label davidka-col-label-alt">Rubik — bold</span>
            <div className="davidka-col-paper davidka-col-paper-alt davidka-col-paper--rubik-bold">
              <p dir="rtl">{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
