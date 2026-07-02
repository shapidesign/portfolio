"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCollectionProducts } from "@/lib/shopify-storefront";
import type { ShopifyCollectionProducts } from "@/lib/shopify-types";

type ShopifyCollectionGridProps = {
  collectionHandle: string;
  productPathPrefix: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
  retryText: string;
  viewDetailsText: string;
};

function formatMoney(amount: string, currencyCode: string) {
  const numeric = Number.parseFloat(amount);
  if (!Number.isFinite(numeric)) return `${amount} ${currencyCode}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function ShopifyCollectionGrid({
  collectionHandle,
  productPathPrefix,
  loadingText,
  emptyText,
  errorText,
  retryText,
  viewDetailsText,
}: ShopifyCollectionGridProps) {
  const [collection, setCollection] = useState<ShopifyCollectionProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setLoading(true);
      try {
        const nextCollection = await getCollectionProducts(collectionHandle);
        setCollection(nextCollection);
        setError(null);
      } catch {
        // On a silent background refresh, keep the products already on screen
        // instead of replacing them with an error state.
        if (!silent) setError(errorText);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [collectionHandle, errorText],
  );

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // Keep the catalog fresh: re-fetch when the tab regains focus and poll while
  // visible, so newly published Shopify/Printify products appear without a reload.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void loadProducts({ silent: true });
    };
    const intervalId = window.setInterval(refresh, 20000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadProducts]);

  if (loading) {
    return (
      <div className="store-grid" aria-hidden>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="store-card store-card-skeleton" key={index}>
            <div className="store-card-media" />
            <div className="store-card-info">
              <span className="store-skeleton-line" />
              <span className="store-skeleton-line store-skeleton-line-short" />
            </div>
          </div>
        ))}
        <span className="sr-only">{loadingText}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-state">
        <p className="subtitle">{error}</p>
        <button type="button" className="button button-primary" onClick={() => void loadProducts()}>
          {retryText}
        </button>
      </div>
    );
  }

  if (!collection || collection.products.length === 0) {
    return <p className="store-state subtitle">{emptyText}</p>;
  }

  return (
    <div className="store-grid">
      {collection.products.map((product) => (
        <article className="store-card" key={product.id}>
          <Link
            href={`${productPathPrefix}/product/?handle=${encodeURIComponent(product.handle)}`}
            className="store-card-link"
          >
            <div className="store-card-media">
              {product.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="store-card-image"
                  loading="lazy"
                />
              ) : (
                <div className="store-card-image store-card-image-fallback" aria-hidden />
              )}
              <span className="store-card-cta">{viewDetailsText}</span>
            </div>
            <div className="store-card-info">
              <h3 className="store-card-title">{product.title}</h3>
              <p className="store-card-price">
                {product.minPrice ? formatMoney(product.minPrice.amount, product.minPrice.currencyCode) : ""}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
