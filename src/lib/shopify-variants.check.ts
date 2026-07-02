// Runnable self-check for the pure variant-resolution logic.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/shopify-variants.check.ts
import type { ShopifyVariant } from "./shopify-types.ts";
import { defaultSelection, deriveOptions, isValueAvailable, resolveVariant } from "./shopify-variants.ts";

function mk(size: string, color: string, availableForSale: boolean): ShopifyVariant {
  return {
    id: `${size}-${color}`,
    title: `${size} / ${color}`,
    availableForSale,
    price: { amount: "100.0", currencyCode: "ILS" },
    selectedOptions: [
      { name: "Size", value: size },
      { name: "Color", value: color },
    ],
    image: null,
  };
}

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`shopify-variants self-check failed: ${msg}`);
};

const variants: ShopifyVariant[] = [
  mk("S", "Black", true),
  mk("S", "Red", false),
  mk("M", "Black", true),
  mk("M", "Red", true),
];

const options = deriveOptions(variants);
assert(options.length === 2, "should derive 2 options");
assert(options[0].name === "Size" && options[0].values.join(",") === "S,M", "size values ordered");
assert(options[1].name === "Color" && options[1].values.join(",") === "Black,Red", "color values ordered");

const resolved = resolveVariant(variants, { Size: "M", Color: "Red" });
assert(resolved?.id === "M-Red", "resolves exact variant");
assert(resolveVariant(variants, { Size: "M" }) === null, "partial selection resolves to null");

// S/Red is sold out -> Red unavailable when Size=S, available when Size=M.
assert(isValueAvailable(variants, { Size: "S" }, "Color", "Red") === false, "S/Red is sold out");
assert(isValueAvailable(variants, { Size: "M" }, "Color", "Red") === true, "M/Red is available");
assert(isValueAvailable(variants, { Color: "Black" }, "Size", "S") === true, "S/Black is available");

const def = defaultSelection(variants);
assert(def.Size === "S" && def.Color === "Black", "default picks first available variant");

console.log("shopify-variants self-check passed");
