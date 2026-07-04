// Storefront filter categories, sourced directly from Shopify collections so the
// website stays in sync with whatever the merchant curates in Shopify admin.

export type StoreCategory =
  | "oversized-front"
  | "oversized-back"
  | "shirts"
  | "toddler-shirts";

/** Display order for the filter bar (matches the Shopify collection handles). */
export const STORE_CATEGORY_ORDER: StoreCategory[] = [
  "oversized-front",
  "oversized-back",
  "shirts",
  "toddler-shirts",
];

/**
 * Pick a product's category from its Shopify collection membership. A product can
 * live in several collections, so we return the first one in display order.
 */
export function categoryOf(collectionHandles: string[]): StoreCategory | null {
  return STORE_CATEGORY_ORDER.find((category) => collectionHandles.includes(category)) ?? null;
}
