"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SITE_COPY_FIELDS,
  SITE_SLUG,
  type SiteCopy,
  type SiteCopyFieldPair,
} from "@/lib/site-copy";

/** EN/HE editor for a slice of site-wide copy. */
export function SiteCopyEditor({
  siteCopy,
  fields = SITE_COPY_FIELDS,
  title = "Site content",
}: {
  siteCopy: SiteCopy;
  fields?: SiteCopyFieldPair[];
  title?: string;
}) {
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
      const payload: SiteCopy = {};
      for (const field of fields) {
        payload[field.en] = text[field.en] ?? "";
        payload[field.he] = text[field.he] ?? "";
      }
      const res = await fetch("/api/admin/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: SITE_SLUG, fields: payload }),
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
        <h2 className="admin-subtitle">{title}</h2>
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

      {fields.map((f, i) => (
        <Fragment key={f.en}>
          {f.section && f.section !== fields[i - 1]?.section ? (
            <h3 className="admin-section">{f.section}</h3>
          ) : null}
          <div className="admin-row">
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
        </Fragment>
      ))}
    </div>
  );
}
