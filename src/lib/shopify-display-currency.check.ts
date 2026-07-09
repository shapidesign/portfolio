import { convertMoney, DISPLAY_CURRENCY, refreshFxRates } from "@/lib/shopify-display-currency";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

void refreshFxRates();

assert(
  convertMoney({ amount: "29.55", currencyCode: "USD" }).currencyCode === DISPLAY_CURRENCY,
  "USD converts to ILS currency code",
);

const converted = convertMoney({ amount: "29.55", currencyCode: "USD" });
assert(Number.parseFloat(converted.amount) > 90, "USD amount converts to a plausible ILS value");

assert(
  convertMoney({ amount: "120", currencyCode: "ILS" }).amount === "120",
  "ILS amounts stay in ILS",
);

console.log("shopify-display-currency.check.ts passed");
