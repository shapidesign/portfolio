"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ShopifyCollectionCarousels } from "@/components/ui/ShopifyCollectionCarousels";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { getDefaultCollectionHandles } from "@/lib/shopify-storefront";

const DEFAULT_SHIRTS_STORE_URL = "https://mundial-laundry.myshopify.com/collections/shirts";
const { shirtsCollectionHandle } = getDefaultCollectionHandles();

function normalizeStoreUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return `https://${trimmed}`;
}

export default function ShirtsPage() {
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const shirtsStoreUrl = normalizeStoreUrl(
    process.env.NEXT_PUBLIC_SHOPIFY_SHIRTS_URL ??
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL ??
      DEFAULT_SHIRTS_STORE_URL,
  );
  const hasStoreLink = shirtsStoreUrl.length > 0;

  return (
    <main className="store-page">
      <section className="section content-wrap store-hero">
        <Reveal>
          <h1 className="text-display font-display">{s.shirtsTitle}</h1>
        </Reveal>
      </section>

      <section className="section content-wrap store-section" aria-live="polite">
        {hasStoreLink ? (
          <>
            <div className="store-toolbar">
              <p className="store-hint">{s.shirtsStoreHint}</p>
              <a
                href={shirtsStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link store-shop-all"
              >
                {s.shopShopAll}
              </a>
            </div>
            <ShopifyCollectionCarousels
              collectionHandle={shirtsCollectionHandle}
              productPathPrefix="/shirts"
              loadingText={s.shopLoading}
              emptyText={s.shirtsEmpty}
              errorText={s.shopCollectionError}
              retryText={s.shopRetry}
              viewDetailsText={s.shopViewDetails}
            />
          </>
        ) : (
          <p className="store-state subtitle">{s.shirtsError}</p>
        )}
      </section>
    </main>
  );
}
