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

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const nextCollection = await getCollectionProducts(collectionHandle);
      setCollection(nextCollection);
      setError(null);
    } catch {
      setError(errorText);
    } finally {
      setLoading(false);
    }
  }, [collectionHandle, errorText]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  if (loading) return <p className="subtitle">{loadingText}</p>;
  if (error) {
    return (
      <div className="shirts-store-panel">
        <p className="subtitle">{error}</p>
        <button type="button" className="button button-primary shirts-store-button" onClick={() => void loadProducts()}>
          {retryText}
        </button>
      </div>
    );
  }

  if (!collection || collection.products.length === 0) {
    return <p className="subtitle">{emptyText}</p>;
  }

  return (
    <div className="shirts-grid">
      {collection.products.map((product) => (
        <article className="shirts-card" key={product.id}>
          <Link href={`${productPathPrefix}/${product.handle}`} className="shirts-card-link">
            <div className="shirts-card-image-wrap">
              {product.featuredImage ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="shirts-card-image"
                  loading="lazy"
                />
              ) : (
                <div className="shirts-card-image shirts-card-image-fallback" aria-hidden />
              )}
            </div>
            <div className="shirts-card-copy">
              <h3 className="shirts-card-title">{product.title}</h3>
              <p className="shirts-card-price">
                {product.minPrice ? formatMoney(product.minPrice.amount, product.minPrice.currencyCode) : ""}
              </p>
              <span className="button shirts-card-cta">{viewDetailsText}</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
