"use client";

import { useId, useState, type FormEvent } from "react";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import {
  WALL_COLORS,
  WALL_MAX_LEN,
  validateWallInput,
  type WallColor,
} from "@/lib/kibbutz-wall";
import { FACES, faceHeName, getFace, type FaceId } from "./faces";
import { SpecimenText } from "./SpecimenText";

type Status = "idle" | "sending" | "sent" | "blocked" | "invalid" | "failed";

const MESSAGES: Record<Exclude<Status, "idle" | "sending">, string> = {
  sent: "המילים שלכם על הקיר!",
  blocked: "המילים האלה לא עולות לקיר. נסו משהו אחר.",
  invalid: "רק עברית, ספרות וסימני פיסוק, עד 40 תווים.",
  failed: "משהו השתבש, נסו שוב.",
};

export function WallForm({ settings }: { settings: KibbutzTypeSettings }) {
  const [text, setText] = useState("");
  const [faceId, setFaceId] = useState<FaceId>("dan");
  const [color, setColor] = useState<WallColor>("navy");
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();
  const face = getFace(faceId);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const check = validateWallInput({ text, face: faceId, color });
    if (!check.ok) {
      setStatus(check.error);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/kibbutz-wall/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check.entry),
      });
      if (res.ok) {
        setText("");
        setStatus("sent");
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(data.error === "blocked" || data.error === "invalid" ? data.error : "failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section className="kt-section kt-section--wall kt-wrap" aria-labelledby={`${id}-title`}>
      <SpecimenText as="h2" id={`${id}-title`} className="kt-wall-title" editable>
        הוסיפו מילים משלכם לקיר
      </SpecimenText>
      <p className="kt-wall-hint">בחרו גופן וצבע, כתבו, ושלחו. המילים יופיעו על הקיר בהרצאה.</p>

      <form className="kt-wall-form" onSubmit={submit}>
        <div className="kt-toggle" role="group" aria-label="בחירת גופן">
          {FACES.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === faceId}
              onClick={() => setFaceId(f.id)}
            >
              {faceHeName(f.id, settings)}
            </button>
          ))}
        </div>

        <fieldset className="kt-swatches">
          <legend className="kt-label">צבע</legend>
          {WALL_COLORS.map((c) => (
            <label key={c.key} className="kt-swatch" style={{ "--kt-swatch": `var(--kt-${c.key})` } as React.CSSProperties}>
              <input
                type="radio"
                name={`${id}-color`}
                value={c.key}
                checked={color === c.key}
                onChange={() => setColor(c.key)}
              />
              <span className="sr-only">{c.he}</span>
            </label>
          ))}
        </fieldset>

        <label htmlFor={`${id}-text`} className="sr-only">
          המילים שלכם
        </label>
        <textarea
          id={`${id}-text`}
          className={`kt-textarea kt-wall-textarea ${face.className}`}
          dir="rtl"
          lang="he"
          rows={2}
          maxLength={WALL_MAX_LEN}
          spellCheck={false}
          placeholder="כתבו כאן..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (status !== "idle" && status !== "sending") setStatus("idle");
          }}
          style={{ color: `var(--kt-${color})` }}
        />

        <div className="kt-wall-actions">
          <output htmlFor={`${id}-text`} className="kt-wall-count">
            {text.length}/{WALL_MAX_LEN}
          </output>
          <button
            type="submit"
            className="kt-wall-submit"
            disabled={status === "sending" || text.trim().length === 0}
          >
            {status === "sending" ? "שולח..." : "שלחו לקיר"}
          </button>
        </div>

        <p className="kt-wall-status" role="status" aria-live="polite" data-status={status}>
          {status in MESSAGES ? MESSAGES[status as keyof typeof MESSAGES] : ""}
        </p>
      </form>
    </section>
  );
}
