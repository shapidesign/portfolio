"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCollectionProducts } from "@/lib/shopify-storefront";
import type { ShopifyCollectionProducts } from "@/lib/shopify-types";
import { categoryOf, STORE_CATEGORY_ORDER, type StoreCategory } from "@/lib/shopify-category";
import { formatShopifyMoney } from "@/lib/format-shopify-money";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

type ShopifyCollectionGridProps = {
  collectionHandle: string;
  productPathPrefix: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
  retryText: string;
  viewDetailsText: string;
};

type FilterValue = StoreCategory | "all";

export function ShopifyCollectionGrid({
  collectionHandle,
  productPathPrefix,
  loadingText,
  emptyText,
  errorText,
  retryText,
  viewDetailsText,
}: ShopifyCollectionGridProps) {
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const [collection, setCollection] = useState<ShopifyCollectionProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

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

  const categoryLabels = useMemo<Record<StoreCategory, string>>(
    () => ({
      "oversized-front": s.catOversizedFront,
      "oversized-back": s.catOversizedBack,
      shirts: s.catTshirts,
      "toddler-shirts": s.catToddler,
    }),
    [s.catOversizedFront, s.catOversizedBack, s.catTshirts, s.catToddler],
  );

  const products = collection?.products ?? [];

  // Count products per category so we only show filters that actually match.
  const counts = useMemo(() => {
    const map = new Map<StoreCategory, number>();
    for (const product of products) {
      const category = categoryOf(product.collectionHandles);
      if (category) map.set(category, (map.get(category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const availableCategories = useMemo(
    () => STORE_CATEGORY_ORDER.filter((category) => (counts.get(category) ?? 0) > 0),
    [counts],
  );

  const visibleProducts = useMemo(
    () =>
      activeFilter === "all"
        ? products
        : products.filter((product) => categoryOf(product.collectionHandles) === activeFilter),
    [products, activeFilter],
  );

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

  if (products.length === 0) {
    return <p className="store-state subtitle">{emptyText}</p>;
  }

  return (
    <>
      {availableCategories.length > 1 ? (
        <div className="store-filters" role="group" aria-label={s.storeFilterAll}>
          <button
            type="button"
            className={`store-filter ${activeFilter === "all" ? "is-active" : ""}`}
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            {s.storeFilterAll}
            <span className="store-filter-count">{products.length}</span>
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`store-filter ${activeFilter === category ? "is-active" : ""}`}
              aria-pressed={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            >
              {categoryLabels[category]}
              <span className="store-filter-count">{counts.get(category)}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="store-grid">
        {visibleProducts.map((product) => (
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
                  {product.minPrice
                    ? formatShopifyMoney(
                        product.minPrice.amount,
                        product.minPrice.currencyCode,
                        lang === "he" ? "he-IL" : "en-IL",
                      )
                    : ""}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
