// Runnable self-check for the admin override merge logic.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/project-overrides.check.ts
import assert from "node:assert/strict";
import { DEFAULT_PROJECT, mergeOverrides } from "./merge-overrides.ts";
import type { Project } from "../types/project.ts";

const base = [
  { slug: "a", title: "A", images: ["1.png", "2.png"] },
  { slug: "b", title: "B", images: [] },
] as unknown as Project[];

const merged = mergeOverrides(base, {
  a: { title: "A edited", heTitle: "אלף", images: ["2.png", "1.png"] },
  "new-project": { title: "Fresh from admin" },
  __site__: { title: "site copy row, not a project" },
});

// Overridden fields win.
assert.equal(merged[0].title, "A edited");
assert.equal(merged[0].heTitle, "אלף");
// Image order override applies.
assert.deepEqual(merged[0].images, ["2.png", "1.png"]);
// Untouched project is unchanged.
assert.equal(merged[1].title, "B");
// Unknown slugs become admin-created projects built on DEFAULT_PROJECT…
assert.equal(merged.length, 3);
const created = merged.find((p) => p.slug === "new-project");
assert.ok(created);
assert.equal(created.title, "Fresh from admin");
assert.equal(created.accent, DEFAULT_PROJECT.accent);
assert.deepEqual(created.images, []);
// …but reserved "__" rows (site copy) never become projects.
assert.ok(!merged.some((p) => p.slug === "__site__"));

// Blank-string overrides never mask base content (e.g. Hebrew fallback bug).
const blanked = mergeOverrides(
  [{ slug: "a", title: "Base", heTitle: "בסיס" }] as unknown as Project[],
  { a: { title: "New", heTitle: "  " } },
);
assert.equal(blanked[0].title, "New");
assert.equal(blanked[0].heTitle, "בסיס");

// New-project slug validation (mirrors the save/upload API gate).
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
assert.ok(SLUG_RE.test("new-project"));
assert.ok(!SLUG_RE.test("__site__"));
assert.ok(!SLUG_RE.test("-bad"));
assert.ok(!SLUG_RE.test("Bad Slug"));
assert.ok(!SLUG_RE.test(""));

console.log("OK: project override merge behaves correctly");
