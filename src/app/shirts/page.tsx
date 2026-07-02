"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ShopifyCartPanel } from "@/components/ui/ShopifyCartPanel";
import { ShopifyCollectionGrid } from "@/components/ui/ShopifyCollectionGrid";
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
    <main className="shirts-page">
      <section className="section content-wrap shirts-hero">
        <Reveal>
          <h1 className="text-display font-display">{s.shirtsTitle}</h1>
          <p className="lead shirts-lead">{s.shirtsLead}</p>
        </Reveal>
      </section>

      <section className="section content-wrap shirts-store-section" aria-live="polite">
        {hasStoreLink ? (
          <Reveal>
            <div className="shopify-marketplace-layout">
              <div className="shirts-store-panel">
                <p className="subtitle">{s.shirtsStoreHint}</p>
                <ShopifyCollectionGrid
                  collectionHandle={shirtsCollectionHandle}
                  productPathPrefix="/shirts"
                  loadingText={s.shopLoading}
                  emptyText={s.shirtsEmpty}
                  errorText={s.shopCollectionError}
                  retryText={s.shopRetry}
                  viewDetailsText={s.shopViewDetails}
                />
                <a
                  href={shirtsStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary shirts-store-button"
                >
                  {s.shirtsBuyNow}
                </a>
              </div>
              <ShopifyCartPanel
                title={s.shopCartTitle}
                emptyText={s.shopCartEmpty}
                checkoutLabel={s.shopCheckout}
                loadingText={s.shopLoading}
                updateErrorText={s.shopUpdateError}
              />
            </div>
          </Reveal>
        ) : (
          <div className="shirts-store-panel">
            <p className="subtitle">{s.shirtsError}</p>
          </div>
        )}
      </section>
    </main>
  );
}
