// Client-side product categorization for the storefront filter bar.
// The Shopify products are all productType "T-Shirt" with inconsistent tags, so
// we derive the category from the title (the only reliable signal today).
// ponytail: title-keyword classifier — if products later get real Shopify
// product types/tags, switch categoryOf() to read those instead.

export type StoreCategory =
  | "front-oversize"
  | "back-oversize"
  | "front-normal"
  | "toddler";

/** Display order for the filter bar. */
export const STORE_CATEGORY_ORDER: StoreCategory[] = [
  "front-oversize",
  "back-oversize",
  "front-normal",
  "toddler",
];

export function categoryOf(title: string): StoreCategory {
  const t = title.toLowerCase();
  if (t.includes("toddler")) return "toddler";

  const isBack = /\bback\b/.test(t); // "back print" / "back design"
  const isOversize = t.includes("oversize") || t.includes("boxy");

  if (isOversize) return isBack ? "back-oversize" : "front-oversize";
  return "front-normal";
}
