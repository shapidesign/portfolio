"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";
import type { SiteCopy } from "@/lib/site-copy";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { ProjectEditor } from "./ProjectEditor";
import { SiteCopyEditor } from "./SiteCopyEditor";
import { KibbutzTypeEditor } from "./KibbutzTypeEditor";

const SITE_CONTENT = "__site-content__";
const KIBBUTZ_TYPE_CONTENT = "__kibbutz-type-content__";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminDashboard({
  projects,
  siteCopy,
  kibbutzTypeSettings,
}: {
  projects: Project[];
  siteCopy: SiteCopy;
  kibbutzTypeSettings: KibbutzTypeSettings;
}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const [creating, setCreating] = useState(false);
  const selected = projects.find((p) => p.slug === selectedSlug);

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.refresh();
  }

  async function createProject() {
    // ponytail: window.prompt is enough for a single-admin tool.
    const title = window.prompt("New project title (English):")?.trim();
    if (!title) return;
    const slug = slugify(title);
    if (!slug) {
      window.alert("Title must contain at least one Latin letter or digit (it becomes the URL).");
      return;
    }
    if (projects.some((p) => p.slug === slug)) {
      window.alert(`A project with the URL "${slug}" already exists.`);
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fields: { title } }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        window.alert(body?.error || "Could not create the project.");
        return;
      }
      setSelectedSlug(slug);
      router.refresh();
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <h1 className="admin-title">Content admin</h1>
        <button className="admin-btn" onClick={logout}>
          Log out
        </button>
      </header>

      <div className="admin-body">
        <nav className="admin-sidebar" aria-label="Content">
          <button
            className={`admin-nav-item${selectedSlug === SITE_CONTENT ? " is-active" : ""}`}
            onClick={() => setSelectedSlug(SITE_CONTENT)}
          >
            Site content
          </button>
          <button
            className={`admin-nav-item${selectedSlug === KIBBUTZ_TYPE_CONTENT ? " is-active" : ""}`}
            onClick={() => setSelectedSlug(KIBBUTZ_TYPE_CONTENT)}
          >
            Kibbutz Type page
          </button>
          <hr className="admin-nav-divider" />
          {projects.map((p) => (
            <button
              key={p.slug}
              className={`admin-nav-item${p.slug === selectedSlug ? " is-active" : ""}`}
              onClick={() => setSelectedSlug(p.slug)}
            >
              {p.title}
            </button>
          ))}
          <button
            className="admin-nav-item admin-nav-new"
            onClick={createProject}
            disabled={creating}
          >
            {creating ? "Creating…" : "+ New project"}
          </button>
        </nav>

        <section className="admin-content">
          {selectedSlug === SITE_CONTENT ? (
            <SiteCopyEditor siteCopy={siteCopy} />
          ) : selectedSlug === KIBBUTZ_TYPE_CONTENT ? (
            <KibbutzTypeEditor initialSettings={kibbutzTypeSettings} />
          ) : selected ? (
            <ProjectEditor key={selected.slug} project={selected} />
          ) : (
            <p>No projects found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
