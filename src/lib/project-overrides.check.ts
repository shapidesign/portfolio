// Runnable self-check for the admin override merge logic.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/project-overrides.check.ts
import assert from "node:assert/strict";
import { mergeOverrides } from "./merge-overrides.ts";
import type { Project } from "../types/project.ts";

const base = [
  { slug: "a", title: "A", images: ["1.png", "2.png"] },
  { slug: "b", title: "B", images: [] },
] as unknown as Project[];

const merged = mergeOverrides(base, {
  a: { title: "A edited", heTitle: "אלף", images: ["2.png", "1.png"] },
  ghost: { title: "should be ignored" },
});

// Overridden fields win.
assert.equal(merged[0].title, "A edited");
assert.equal(merged[0].heTitle, "אלף");
// Image order override applies.
assert.deepEqual(merged[0].images, ["2.png", "1.png"]);
// Untouched project is unchanged.
assert.equal(merged[1].title, "B");
// Overrides for unknown slugs never add phantom projects.
assert.equal(merged.length, 2);
assert.ok(!merged.some((p) => p.slug === "ghost"));

console.log("OK: project override merge behaves correctly");
