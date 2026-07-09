import { convertMoney, DISPLAY_CURRENCY } from "@/lib/shopify-display-currency";

export function formatShopifyMoney(amount: string, currencyCode: string, locale?: string) {
  const { amount: displayAmount } = convertMoney({ amount, currencyCode });
  const numeric = Number.parseFloat(displayAmount);
  if (!Number.isFinite(numeric)) return `${amount} ${currencyCode}`;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: DISPLAY_CURRENCY,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numeric);
}
