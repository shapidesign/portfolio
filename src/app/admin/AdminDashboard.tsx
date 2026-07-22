"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";
import { ProjectEditor } from "./ProjectEditor";

export function AdminDashboard({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const selected = projects.find((p) => p.slug === selectedSlug);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
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
        <nav className="admin-sidebar" aria-label="Projects">
          {projects.map((p) => (
            <button
              key={p.slug}
              className={`admin-nav-item${p.slug === selectedSlug ? " is-active" : ""}`}
              onClick={() => setSelectedSlug(p.slug)}
            >
              {p.title}
            </button>
          ))}
        </nav>

        <section className="admin-content">
          {selected ? (
            <ProjectEditor key={selected.slug} project={selected} />
          ) : (
            <p>No projects found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
