"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ShopifyProductCarousel } from "@/components/ui/ShopifyProductCarousel";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { SHIRTS_BEST_SELLER_HANDLES } from "@/lib/shopify-best-sellers";
import { categoryOf, STORE_CATEGORY_ORDER, type StoreCategory } from "@/lib/shopify-category";
import { getCollectionProducts } from "@/lib/shopify-storefront";
import type { ShopifyCollectionProducts, ShopifyProductCard } from "@/lib/shopify-types";

type ShopifyCollectionCarouselsProps = {
  collectionHandle: string;
  productPathPrefix: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
  retryText: string;
  viewDetailsText: string;
};

function pickProductsByHandle(products: ShopifyProductCard[], handles: readonly string[]) {
  const byHandle = new Map(products.map((product) => [product.handle, product]));
  return handles.flatMap((handle) => {
    const product = byHandle.get(handle);
    return product ? [product] : [];
  });
}

export function ShopifyCollectionCarousels({
  collectionHandle,
  productPathPrefix,
  loadingText,
  emptyText,
  errorText,
  retryText,
  viewDetailsText,
}: ShopifyCollectionCarouselsProps) {
  const { lang } = useLanguage();
  const s = useTranslation(lang);
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

  const bestSellers = useMemo(
    () => pickProductsByHandle(products, SHIRTS_BEST_SELLER_HANDLES),
    [products],
  );

  const productsByCategory = useMemo(() => {
    const grouped = new Map<StoreCategory, ShopifyProductCard[]>();
    for (const product of products) {
      const category = categoryOf(product.collectionHandles);
      if (!category) continue;
      const list = grouped.get(category) ?? [];
      list.push(product);
      grouped.set(category, list);
    }
    return grouped;
  }, [products]);

  if (loading) {
    return (
      <div className="store-carousels">
        <div className="store-carousel-section">
          <div className="store-carousel-header">
            <span className="store-skeleton-line store-carousel-title-skeleton" />
          </div>
          <div className="store-carousel-track" aria-hidden>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="store-card store-carousel-card store-card-skeleton" key={index}>
                <div className="store-card-media" />
                <div className="store-card-info">
                  <span className="store-skeleton-line" />
                  <span className="store-skeleton-line store-skeleton-line-short" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
    <div className="store-carousels">
      {bestSellers.length > 0 ? (
        <ShopifyProductCarousel
          id="store-best-sellers"
          title={s.shopBestSellers}
          products={bestSellers}
          productPathPrefix={productPathPrefix}
          viewDetailsText={viewDetailsText}
          prevLabel={s.shopCarouselPrev}
          nextLabel={s.shopCarouselNext}
        />
      ) : null}

      {STORE_CATEGORY_ORDER.map((category) => {
        const categoryProducts = productsByCategory.get(category);
        if (!categoryProducts?.length) return null;
        return (
          <ShopifyProductCarousel
            key={category}
            id={`store-collection-${category}`}
            title={categoryLabels[category]}
            products={categoryProducts}
            productPathPrefix={productPathPrefix}
            viewDetailsText={viewDetailsText}
            prevLabel={s.shopCarouselPrev}
            nextLabel={s.shopCarouselNext}
          />
        );
      })}
    </div>
  );
}
