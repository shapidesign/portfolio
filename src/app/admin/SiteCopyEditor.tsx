"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SITE_COPY_FIELDS,
  SITE_SLUG,
  type SiteCopy,
} from "@/lib/site-copy";

/** EN/HE editor for site-wide copy (home hero + main CTAs). */
export function SiteCopyEditor({ siteCopy }: { siteCopy: SiteCopy }) {
  const router = useRouter();
  const [text, setText] = useState<SiteCopy>(siteCopy);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set(key: string, value: string) {
    setText((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: SITE_SLUG, fields: text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setMessage(body?.error || "Save failed.");
        return;
      }
      setMessage("Saved. Changes are live.");
      router.refresh();
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-editor">
      <div className="admin-savebar">
        <h2 className="admin-subtitle">Site content</h2>
        <div className="admin-savebar-actions">
          {message && <span className="admin-savemsg">{message}</span>}
          <button
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="admin-col-heads" aria-hidden>
        <span />
        <span className="admin-col-head">English</span>
        <span className="admin-col-head">עברית</span>
      </div>

      {SITE_COPY_FIELDS.map((f) => (
        <div className="admin-row" key={f.en}>
          <span className="admin-row-label">{f.label}</span>
          {f.multiline ? (
            <textarea
              className="admin-input admin-textarea"
              value={text[f.en] ?? ""}
              onChange={(e) => set(f.en, e.target.value)}
            />
          ) : (
            <input
              className="admin-input"
              value={text[f.en] ?? ""}
              onChange={(e) => set(f.en, e.target.value)}
            />
          )}
          {f.multiline ? (
            <textarea
              className="admin-input admin-textarea"
              dir="rtl"
              value={text[f.he] ?? ""}
              onChange={(e) => set(f.he, e.target.value)}
            />
          ) : (
            <input
              className="admin-input"
              dir="rtl"
              value={text[f.he] ?? ""}
              onChange={(e) => set(f.he, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
