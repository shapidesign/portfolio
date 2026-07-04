// Runnable self-check for the pure collection -> category classifier.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/shopify-category.check.ts
import { categoryOf } from "./shopify-category.ts";

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`shopify-category self-check failed: ${msg}`);
};

assert(categoryOf(["oversized-front"]) === "oversized-front", "single collection");
assert(categoryOf(["shirts"]) === "shirts", "t-shirts collection");
assert(categoryOf(["toddler-shirts"]) === "toddler-shirts", "toddler collection");
assert(categoryOf(["oversized-back"]) === "oversized-back", "back design collection");
// Multiple memberships resolve to the first in display order.
assert(categoryOf(["toddler-shirts", "oversized-front"]) === "oversized-front", "display-order priority");
assert(categoryOf(["some-random-handle"]) === null, "unknown collection -> null");
assert(categoryOf([]) === null, "no collections -> null");

console.log("shopify-category self-check passed");
