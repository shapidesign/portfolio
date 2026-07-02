import type { ShopifyVariant } from "@/lib/shopify-types";

export type SelectedOptions = Record<string, string>;

export type ProductOption = {
  name: string;
  values: string[];
};

/** Ordered list of options (Size, Color, ...) derived from variant selectedOptions. */
export function deriveOptions(variants: ShopifyVariant[]): ProductOption[] {
  const options: ProductOption[] = [];
  for (const variant of variants) {
    for (const { name, value } of variant.selectedOptions) {
      let option = options.find((entry) => entry.name === name);
      if (!option) {
        option = { name, values: [] };
        options.push(option);
      }
      if (!option.values.includes(value)) option.values.push(value);
    }
  }
  return options;
}

function variantMatches(variant: ShopifyVariant, selected: SelectedOptions): boolean {
  return Object.entries(selected).every(([name, value]) =>
    variant.selectedOptions.some((option) => option.name === name && option.value === value),
  );
}

/** The variant whose options exactly match the full selection, or null. */
export function resolveVariant(variants: ShopifyVariant[], selected: SelectedOptions): ShopifyVariant | null {
  return (
    variants.find(
      (variant) =>
        variant.selectedOptions.length === Object.keys(selected).length && variantMatches(variant, selected),
    ) ?? null
  );
}

/**
 * Whether choosing `value` for `optionName` still yields a purchasable variant,
 * holding all other currently-selected options fixed.
 */
export function isValueAvailable(
  variants: ShopifyVariant[],
  selected: SelectedOptions,
  optionName: string,
  value: string,
): boolean {
  const hypothetical: SelectedOptions = { ...selected, [optionName]: value };
  return variants.some(
    (variant) => variant.availableForSale && variantMatches(variant, hypothetical),
  );
}

/** Default selection: options of the first available variant, else the first variant. */
export function defaultSelection(variants: ShopifyVariant[]): SelectedOptions {
  const base = variants.find((variant) => variant.availableForSale) ?? variants[0];
  if (!base) return {};
  return Object.fromEntries(base.selectedOptions.map((option) => [option.name, option.value]));
}

export function runSelfCheck() {
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
}

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
  };
}

const isMain = typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]}`;
if (isMain) runSelfCheck();
