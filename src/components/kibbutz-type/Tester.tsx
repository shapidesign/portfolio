"use client";

import { useId } from "react";
import { FACES, type Face, type FaceId } from "./faces";

type TesterProps = Readonly<{
  text: string;
  fontSize: number;
  face: Face;
  alternatesEnabled: boolean;
  onText: (value: string) => void;
  onFontSize: (value: number) => void;
  onFace: (id: FaceId) => void;
  onAlternates: (enabled: boolean) => void;
}>;

type RangeProps = Readonly<{
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}>;

function Range({ label, value, display, min, max, step, onChange }: RangeProps) {
  const id = useId();
  return (
    <div className="kt-range">
      <div className="kt-range-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Tester({
  text,
  fontSize,
  face,
  alternatesEnabled,
  onText,
  onFontSize,
  onFace,
  onAlternates,
}: TesterProps) {
  const textareaId = useId();
  return (
    <section
      className={`kt-section kt-section--tester kt-face-ui--${face.id} kt-wrap`}
      aria-labelledby={`${textareaId}-title`}
    >
      <p className="kt-label" id={`${textareaId}-title`}>
        נסו בעצמכם
      </p>

      <div className="kt-toggle" role="group" aria-label="בחירת גופן">
        {FACES.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.id === face.id}
            onClick={() => onFace(f.id)}
          >
            {f.heName}
          </button>
        ))}
      </div>

      <label htmlFor={textareaId} className="sr-only">
        טקסט לבדיקה
      </label>
      <textarea
        id={textareaId}
        className={`kt-textarea ${face.className}`}
        dir="rtl"
        lang="he"
        rows={2}
        spellCheck={false}
        value={text}
        onChange={(e) => onText(e.target.value)}
        style={{ fontSize: `${fontSize}px` }}
      />

      <div className="kt-controls">
        <Range
          label="גודל"
          value={fontSize}
          display={`${fontSize}px`}
          min={24}
          max={200}
          step={1}
          onChange={onFontSize}
        />
        {face.id === "dan" ? (
          <button
            type="button"
            className="kt-feature-toggle"
            aria-pressed={alternatesEnabled}
            onClick={() => onAlternates(!alternatesEnabled)}
          >
            <span>
              אותיות חלופיות <small>ss01</small>
            </span>
            <span className="kt-feature-sample kt-face-dan" aria-hidden>
              אגכעפףצ
            </span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
