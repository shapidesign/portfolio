// Runnable self-check for the pure title -> category classifier.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/shopify-category.check.ts
import { categoryOf } from "./shopify-category.ts";

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`shopify-category self-check failed: ${msg}`);
};

assert(categoryOf("Oversized Boxy T-Shirt - Messi") === "front-oversize", "boxy oversized front");
assert(categoryOf("Oversized T-shirt Back Design - Dibu Martinez 2022") === "back-oversize", "oversized back design");
assert(categoryOf("Unisex Heavy Cotton Tee - Van Persie") === "front-normal", "heavy cotton = normal tee");
assert(categoryOf("Toddler Jersey Tee - Messi") === "toddler", "toddler wins over everything");
assert(categoryOf("Oversized Toddler Tee") === "toddler", "toddler beats oversize");
assert(categoryOf("Regular Tee Back Print - Zidane") === "front-normal", "back print but not oversized -> normal");

console.log("shopify-category self-check passed");
