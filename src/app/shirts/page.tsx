"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ShopifyCollectionEmbed } from "@/components/ui/ShopifyCollectionEmbed";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

const DEFAULT_SHIRTS_STORE_URL = "https://mundial-laundry.myshopify.com/collections/shirts";
const DEFAULT_SHIRTS_COLLECTION_ID = "484456038640";

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
  const shirtsCollectionId = process.env.NEXT_PUBLIC_SHOPIFY_SHIRTS_COLLECTION_ID ?? DEFAULT_SHIRTS_COLLECTION_ID;
  const hasStoreLink = shirtsStoreUrl.length > 0;
  const hasCollectionId = shirtsCollectionId.length > 0;

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
            <div className="shirts-store-panel">
              <p className="subtitle">{s.shirtsStoreHint}</p>
              {hasCollectionId ? <ShopifyCollectionEmbed collectionId={shirtsCollectionId} /> : null}
              <a
                href={shirtsStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary shirts-store-button"
              >
                {s.shirtsBuyNow}
              </a>
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
