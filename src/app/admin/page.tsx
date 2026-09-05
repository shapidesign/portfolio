import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";
import {
  getKibbutzTypeSettings,
  getProjects,
  getSiteCopy,
} from "@/lib/project-overrides";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import "./admin.css";

// Reads the session cookie + live overrides on every request.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = isValidSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!authed) return <AdminLogin />;

  const [projects, siteCopy, kibbutzTypeSettings] = await Promise.all([
    getProjects(),
    getSiteCopy(),
    getKibbutzTypeSettings(),
  ]);
  return (
    <AdminDashboard
      projects={projects}
      siteCopy={siteCopy}
      kibbutzTypeSettings={kibbutzTypeSettings}
    />
  );
}
