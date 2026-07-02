"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProductByHandle } from "@/lib/shopify-storefront";
import type { ShopifyProductDetail } from "@/lib/shopify-types";
import {
  defaultSelection,
  deriveOptions,
  isValueAvailable,
  resolveVariant,
  type SelectedOptions,
} from "@/lib/shopify-variants";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

function isColorOption(name: string) {
  return /colou?r/i.test(name);
}

function toCssColor(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

type ShopifyProductDetailClientProps = {
  handle: string;
  backHref: string;
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

export function ShopifyProductDetailClient({ handle, backHref }: ShopifyProductDetailClientProps) {
  const { lang } = useLanguage();
  const s = useTranslation(lang);
  const { addLines } = useCart();
  const [product, setProduct] = useState<ShopifyProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const nextProduct = await getProductByHandle(handle);
      setProduct(nextProduct);
      setActiveImageUrl(nextProduct?.images[0]?.url ?? nextProduct?.featuredImage?.url ?? null);
      setSelected(nextProduct ? defaultSelection(nextProduct.variants) : {});
      setError(null);
    } catch {
      setError(s.shopProductError);
    } finally {
      setLoading(false);
    }
  }, [handle, s.shopProductError]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const options = useMemo(() => (product ? deriveOptions(product.variants) : []), [product]);

  const selectedVariant = useMemo(
    () => (product ? resolveVariant(product.variants, selected) : null),
    [product, selected],
  );

  const chooseOption = useCallback((name: string, value: string) => {
    setSelected((prev) => ({ ...prev, [name]: value }));
    setStatusMessage(null);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    const ok = await addLines([{ merchandiseId: selectedVariant.id, quantity }]);
    setStatusMessage(ok ? s.shopAddedToCart : s.shopUpdateError);
    setIsAdding(false);
  }, [addLines, quantity, s.shopAddedToCart, s.shopUpdateError, selectedVariant]);

  const soldOut = Boolean(selectedVariant && !selectedVariant.availableForSale);

  return (
    <main className="store-page store-pdp">
      <section className="section content-wrap" aria-live="polite">
        <Link href={backHref} className="store-back">
          <span aria-hidden>←</span> {s.shopBackToCollection}
        </Link>

        {loading ? <p className="store-state subtitle">{s.shopLoading}</p> : null}

        {error ? (
          <div className="store-state">
            <p className="subtitle">{error}</p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => void loadProduct()}
            >
              {s.shopRetry}
            </button>
          </div>
        ) : null}

        {!loading && !error && !product ? (
          <p className="store-state subtitle">{s.shopProductNotFound}</p>
        ) : null}

        {product ? (
          <div className="pdp-layout">
            <div className="pdp-gallery">
              <div className="pdp-main-media">
                {activeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeImageUrl} alt={product.title} className="pdp-main-image" />
                ) : (
                  <div className="pdp-main-image pdp-main-fallback" aria-hidden />
                )}
              </div>
              {product.images.length > 1 ? (
                <div className="pdp-thumbs" role="list">
                  {product.images.map((image) => (
                    <button
                      type="button"
                      key={image.url}
                      className={`pdp-thumb ${activeImageUrl === image.url ? "is-active" : ""}`}
                      onClick={() => setActiveImageUrl(image.url)}
                      aria-label={image.altText || product.title}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="pdp-buybox">
              <h1 className="pdp-title font-display">{product.title}</h1>
              {selectedVariant?.price ? (
                <p className="pdp-price">
                  {formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                </p>
              ) : null}

              {product.description ? <p className="pdp-description">{product.description}</p> : null}

              {options.map((option) => {
                const isColor = isColorOption(option.name);
                return (
                  <div key={option.name} className="pdp-option">
                    <span className="pdp-option-label">{option.name}</span>
                    <div className="pdp-option-values" role="group" aria-label={option.name}>
                      {option.values.map((value) => {
                        const available = isValueAvailable(product.variants, selected, option.name, value);
                        const isSelected = selected[option.name] === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            className={`pdp-option-pill ${isColor ? "is-swatch" : ""} ${
                              isSelected ? "is-selected" : ""
                            } ${available ? "" : "is-unavailable"}`}
                            aria-pressed={isSelected}
                            disabled={!available}
                            title={available ? value : `${value} — ${s.shopOptionUnavailable}`}
                            onClick={() => chooseOption(option.name, value)}
                          >
                            {isColor ? (
                              <>
                                <span
                                  className="pdp-swatch"
                                  style={{ backgroundColor: toCssColor(value) }}
                                  aria-hidden="true"
                                />
                                <span>{value}</span>
                              </>
                            ) : (
                              value
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pdp-buy-row">
                <div className="qty-stepper" role="group" aria-label={s.shopQuantity}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="−"
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="button button-primary pdp-add"
                  disabled={!selectedVariant || soldOut || isAdding}
                  onClick={() => void handleAddToCart()}
                >
                  {soldOut ? s.shopOptionUnavailable : isAdding ? s.shopAddingToCart : s.shopAddToCart}
                </button>
              </div>

              {statusMessage ? (
                <p className="pdp-status" role="status">
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
