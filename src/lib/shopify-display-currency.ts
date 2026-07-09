import type { ShopifyMoney } from "@/lib/shopify-types";

export const DISPLAY_CURRENCY = "ILS" as const;

const FALLBACK_USD_TO_ILS = 3.65;

function readEnvRate(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// ponytail: in-memory FX table; upgrade path is Shopify Markets / Israeli checkout.
let ratesToIls: Record<string, number> = {
  ILS: 1,
  USD: readEnvRate("NEXT_PUBLIC_USD_TO_ILS_RATE", FALLBACK_USD_TO_ILS),
};

let refreshPromise: Promise<void> | null = null;

export async function refreshFxRates(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch("https://api.frankfurter.app/latest?from=USD&to=ILS");
      if (!response.ok) return;
      const payload = (await response.json()) as { rates?: { ILS?: number } };
      const usdToIls = payload.rates?.ILS;
      if (typeof usdToIls === "number" && usdToIls > 0) {
        ratesToIls = { ...ratesToIls, USD: usdToIls };
      }
    } catch {
      // Keep env/default fallback when the FX API is unavailable.
    }
  })();

  return refreshPromise;
}

function roundIlsAmount(amount: number): string {
  return String(Math.round(amount));
}

export function convertMoney(money: ShopifyMoney): ShopifyMoney {
  const code = money.currencyCode.toUpperCase();
  const amount = Number.parseFloat(money.amount);
  if (!Number.isFinite(amount)) return money;

  if (code === DISPLAY_CURRENCY) {
    return { amount: roundIlsAmount(amount), currencyCode: DISPLAY_CURRENCY };
  }

  const rate = ratesToIls[code];
  if (!rate) return money;

  return {
    amount: roundIlsAmount(amount * rate),
    currencyCode: DISPLAY_CURRENCY,
  };
}
