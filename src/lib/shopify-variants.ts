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

