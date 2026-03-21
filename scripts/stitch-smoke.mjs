/**
 * Verifies STITCH_API_KEY by listing Stitch projects.
 * Run: node --env-file=.env.local scripts/stitch-smoke.mjs
 */
import { stitch } from "@google/stitch-sdk";

if (!process.env.STITCH_API_KEY) {
  console.error("Missing STITCH_API_KEY. Use: node --env-file=.env.local scripts/stitch-smoke.mjs");
  process.exit(1);
}

const projects = await stitch.projects();
console.log(`Stitch OK — ${projects.length} project(s).`);
for (const p of projects) {
  console.log(`  ${p.projectId ?? p.id}`);
}
