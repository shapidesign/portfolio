"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KIBBUTZ_TYPE_FIELD_GROUPS,
  KIBBUTZ_TYPE_MEDIA_FIELDS,
  KIBBUTZ_TYPE_SLUG,
  type KibbutzTypeField,
  type KibbutzTypeSettings,
} from "@/lib/kibbutz-type-settings";

const UPLOAD_SLUG = "kibbutz-type";

export function KibbutzTypeEditor({
  initialSettings,
}: {
  initialSettings: KibbutzTypeSettings;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<keyof KibbutzTypeSettings | null>(null);
  const [message, setMessage] = useState("");

  function set(key: keyof KibbutzTypeSettings, value: string | number) {
    setSettings((previous) => ({ ...previous, [key]: value }));
  }

  async function upload(key: keyof KibbutzTypeSettings, file?: File) {
    if (!file) return;
    setUploading(key);
    setMessage("");
    try {
      const form = new FormData();
      form.append("slug", UPLOAD_SLUG);
      form.append("file", file);
      const response = await fetch("/api/admin/upload/", { method: "POST", body: form });
      const body = await response.json().catch(() => null);
      if (!response.ok || typeof body?.url !== "string") {
        setMessage(body?.error || "Upload failed.");
        return;
      }
      set(key, body.url);
      setMessage("Image uploaded. Save changes to publish it.");
    } catch {
      setMessage("Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: KIBBUTZ_TYPE_SLUG, fields: settings }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
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

  function renderField(field: KibbutzTypeField) {
    const value = settings[field.key];
    const common = {
      id: `kt-${field.key}`,
      className: "admin-input",
      dir: field.dir,
      value: String(value),
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) =>
        set(
          field.key,
          field.type === "number" ? Number(event.target.value) : event.target.value,
        ),
    };

    if (field.type === "textarea") {
      return <textarea {...common} className="admin-input admin-textarea" />;
    }
    if (field.type === "color") {
      return (
        <div className="admin-color-field">
          <input
            aria-label={`${field.label} color picker`}
            type="color"
            value={String(value)}
            onChange={(event) => set(field.key, event.target.value)}
          />
          <input {...common} pattern="#[0-9a-fA-F]{6}" />
        </div>
      );
    }
    return (
      <input
        {...common}
        type={field.type ?? "text"}
        {...(field.type === "number" ? { min: 24, max: 200, step: 1 } : {})}
      />
    );
  }

  return (
    <div className="admin-editor">
      <div className="admin-savebar">
        <h2 className="admin-subtitle">Kibbutz Type page</h2>
        <div className="admin-savebar-actions">
          {message && <span className="admin-savemsg">{message}</span>}
          <button
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving || uploading !== null}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <p className="admin-editor-note">
        These fields control the specimen page. Font files, glyph coverage, and OpenType mappings
        remain code-managed.
      </p>

      {KIBBUTZ_TYPE_FIELD_GROUPS.map((group) => (
        <section className="admin-settings-group" key={group.title}>
          <h3 className="admin-subtitle">{group.title}</h3>
          {group.fields.map((field) => (
            <div className="admin-field" key={field.key}>
              <label className="admin-label" htmlFor={`kt-${field.key}`}>
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </section>
      ))}

      <section className="admin-settings-group">
        <h3 className="admin-subtitle">Story images</h3>
        {KIBBUTZ_TYPE_MEDIA_FIELDS.map((field) => {
          const src = String(settings[field.key]);
          const isUploading = uploading === field.key;
          return (
            <div className="admin-media-field" key={field.key}>
              <label className="admin-label" htmlFor={`kt-${field.key}`}>
                {field.label}
              </label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="admin-media-preview" src={src} alt="" />
              <input
                id={`kt-${field.key}`}
                className="admin-input"
                value={src}
                onChange={(event) => set(field.key, event.target.value)}
              />
              <label className="admin-btn">
                {isUploading ? "Uploading…" : "Replace image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploading !== null}
                  onChange={(event) => upload(field.key, event.target.files?.[0])}
                />
              </label>
            </div>
          );
        })}
      </section>
    </div>
  );
}
