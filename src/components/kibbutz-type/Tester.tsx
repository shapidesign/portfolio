"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { FACES, faceHeName, type Face, type FaceId } from "./faces";

const DEFAULT_WIDTH = 500;

type TesterProps = Readonly<{
  text: string;
  fontSize: number;
  face: Face;
  settings: KibbutzTypeSettings;
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

/** Uncontrolled + rAF: drag only paints --kt-wdth, no React re-renders mid-slide. */
function WidthRange({
  label,
  min,
  max,
  step,
  defaultValue,
  targetRef,
}: Readonly<{
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  targetRef: RefObject<HTMLElement | null>;
}>) {
  const id = useId();
  const outputRef = useRef<HTMLOutputElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    targetRef.current?.style.setProperty("--kt-wdth", String(defaultValue));
    if (outputRef.current) outputRef.current.textContent = String(defaultValue);
  }, [defaultValue, targetRef]);

  return (
    <div className="kt-range">
      <div className="kt-range-head">
        <label htmlFor={id}>{label}</label>
        <output ref={outputRef} htmlFor={id}>
          {defaultValue}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onInput={(e) => {
          const next = Number(e.currentTarget.value);
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            if (outputRef.current) outputRef.current.textContent = String(next);
            targetRef.current?.style.setProperty("--kt-wdth", String(next));
          });
        }}
      />
    </div>
  );
}

export function Tester({
  text,
  fontSize,
  face,
  settings,
  alternatesEnabled,
  onText,
  onFontSize,
  onFace,
  onAlternates,
}: TesterProps) {
  const textareaId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`kt-section kt-section--tester kt-face-ui--${face.id} kt-wrap`}
      aria-labelledby={`${textareaId}-title`}
    >
      <p className="kt-label" id={`${textareaId}-title`}>
        {settings.testerLabel}
      </p>

      <div className="kt-toggle" role="group" aria-label="בחירת גופן">
        {FACES.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.id === face.id}
            onClick={() => onFace(f.id)}
          >
            {faceHeName(f.id, settings)}
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
          label={settings.fontSizeLabel}
          value={fontSize}
          display={`${fontSize}px`}
          min={24}
          max={200}
          step={1}
          onChange={onFontSize}
        />
        {face.id === "babayit" ? (
          <WidthRange
            key="babayit-width"
            label={settings.widthLabel}
            min={100}
            max={1000}
            step={10}
            defaultValue={DEFAULT_WIDTH}
            targetRef={sectionRef}
          />
        ) : null}
        {face.id === "dan" ? (
          <button
            type="button"
            className="kt-feature-toggle"
            aria-pressed={alternatesEnabled}
            onClick={() => onAlternates(!alternatesEnabled)}
          >
            <span>
              {settings.alternatesLabel} <small>ss01</small>
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
