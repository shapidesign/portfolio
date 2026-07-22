"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";
import { SINGLE_FIELDS, TAG_FIELDS, TEXT_FIELDS } from "@/lib/admin-fields";

function str(project: Project, key: keyof Project): string {
  const value = project[key];
  return typeof value === "string" ? value : "";
}

function joinTags(value: unknown): string {
  return Array.isArray(value) ? value.join(", ") : "";
}

function splitTags(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildInitialText(project: Project): Record<string, string> {
  const text: Record<string, string> = {};
  for (const f of TEXT_FIELDS) {
    text[f.en] = str(project, f.en);
    text[f.he] = str(project, f.he);
  }
  for (const f of SINGLE_FIELDS) {
    text[f.key] = str(project, f.key);
  }
  text[TAG_FIELDS.en] = joinTags(project.tags);
  text[TAG_FIELDS.he] = joinTags(project.heTags);
  return text;
}

export function ProjectEditor({ project }: { project: Project }) {
  const router = useRouter();
  const [text, setText] = useState<Record<string, string>>(() =>
    buildInitialText(project),
  );
  const [images, setImages] = useState<string[]>(project.images ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function set(key: string, value: string) {
    setText((prev) => ({ ...prev, [key]: value }));
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage("");
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("slug", project.slug);
        form.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          setMessage("Upload failed. Check the file and try again.");
          continue;
        }
        const { url } = await res.json();
        if (typeof url === "string") setImages((prev) => [...prev, url]);
      }
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const fields: Record<string, unknown> = { ...text };
    fields[TAG_FIELDS.en] = splitTags(text[TAG_FIELDS.en] ?? "");
    fields[TAG_FIELDS.he] = splitTags(text[TAG_FIELDS.he] ?? "");
    fields.images = images;
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: project.slug, fields }),
      });
      if (!res.ok) {
        setMessage("Save failed.");
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
        <h2 className="admin-subtitle">{project.title}</h2>
        <div className="admin-savebar-actions">
          {message && <span className="admin-savemsg">{message}</span>}
          <button
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving || uploading}
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

      {TEXT_FIELDS.map((f) => (
        <div className="admin-row" key={f.en as string}>
          <span className="admin-row-label">{f.label}</span>
          {f.multiline ? (
            <textarea
              className="admin-input admin-textarea"
              value={text[f.en] ?? ""}
              onChange={(e) => set(f.en as string, e.target.value)}
            />
          ) : (
            <input
              className="admin-input"
              value={text[f.en] ?? ""}
              onChange={(e) => set(f.en as string, e.target.value)}
            />
          )}
          {f.multiline ? (
            <textarea
              className="admin-input admin-textarea"
              dir="rtl"
              value={text[f.he] ?? ""}
              onChange={(e) => set(f.he as string, e.target.value)}
            />
          ) : (
            <input
              className="admin-input"
              dir="rtl"
              value={text[f.he] ?? ""}
              onChange={(e) => set(f.he as string, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="admin-row">
        <span className="admin-row-label">{TAG_FIELDS.label} (comma separated)</span>
        <input
          className="admin-input"
          value={text[TAG_FIELDS.en] ?? ""}
          onChange={(e) => set(TAG_FIELDS.en, e.target.value)}
        />
        <input
          className="admin-input"
          dir="rtl"
          value={text[TAG_FIELDS.he] ?? ""}
          onChange={(e) => set(TAG_FIELDS.he, e.target.value)}
        />
      </div>

      {SINGLE_FIELDS.map((f) => (
        <div className="admin-row admin-row--single" key={f.key as string}>
          <span className="admin-row-label">{f.label}</span>
          <input
            className="admin-input"
            value={text[f.key] ?? ""}
            onChange={(e) => set(f.key as string, e.target.value)}
          />
        </div>
      ))}

      <div className="admin-images">
        <h3 className="admin-subtitle">Images (order shown on the site)</h3>

        <div
          className="admin-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            uploadFiles(e.dataTransfer.files);
          }}
        >
          <p>{uploading ? "Uploading…" : "Drag & drop images here, or"}</p>
          <label className="admin-btn">
            Choose files
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        </div>

        <ul className="admin-image-list">
          {images.map((src, index) => (
            <li className="admin-image-item" key={`${src}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="admin-thumb" src={src} alt="" />
              <span className="admin-image-src">{src}</span>
              <div className="admin-image-actions">
                <button
                  className="admin-btn admin-btn-sm"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  className="admin-btn admin-btn-sm"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  onClick={() => removeImage(index)}
                  aria-label="Remove"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {images.length === 0 && (
            <li className="admin-image-empty">No images yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
