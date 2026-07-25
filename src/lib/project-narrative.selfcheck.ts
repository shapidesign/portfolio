/**
 * ponytail: runnable check for fluid story blocks.
 * Run: npx tsx src/lib/project-narrative.selfcheck.ts
 */
import assert from "node:assert/strict";
import {
  DEFAULT_NARRATIVE_LABELS,
  getNarrativeBlocks,
} from "./project-narrative";
import type { Project } from "@/types/project";

const base = { slug: "x", title: "X" } as Project;

const three = getNarrativeBlocks(
  {
    ...base,
    narrativeChallenge: "A",
    narrativeApproach: "B",
    narrativeDecision: "C",
  },
  false,
);
assert.equal(three.length, 3);
assert.equal(three[0].label, DEFAULT_NARRATIVE_LABELS.en[0]);

const one = getNarrativeBlocks(
  {
    ...base,
    narrativeChallenge: "Just one paragraph.",
    narrativeChallengeLabel: "",
    narrativeApproach: "",
    narrativeDecision: "",
  },
  false,
);
assert.equal(one.length, 1);
assert.equal(one[0].label, null);
assert.equal(one[0].body, "Just one paragraph.");

const custom = getNarrativeBlocks(
  {
    ...base,
    narrativeChallenge: "Body",
    narrativeChallengeLabel: "Insight",
    heNarrativeChallenge: "גוף",
    heNarrativeChallengeLabel: "תובנה",
  },
  true,
);
assert.equal(custom.length, 1);
assert.equal(custom[0].label, "תובנה");
assert.equal(custom[0].body, "גוף");

console.log("project-narrative.selfcheck: ok");
