"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProductByHandle } from "@/lib/shopify-storefront";
import type { ShopifyImage, ShopifyProductDetail } from "@/lib/shopify-types";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const nextProduct = await getProductByHandle(handle, lang);
      setProduct(nextProduct);
      setActiveIndex(0);
      setSelected(nextProduct ? defaultSelection(nextProduct.variants) : {});
      setError(null);
    } catch {
      setError(s.shopProductError);
    } finally {
      setLoading(false);
    }
  }, [handle, lang, s.shopProductError]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const options = useMemo(() => (product ? deriveOptions(product.variants) : []), [product]);

  const selectedVariant = useMemo(
    () => (product ? resolveVariant(product.variants, selected) : null),
    [product, selected],
  );

  const galleryImages = useMemo<ShopifyImage[]>(() => {
    if (!product) return [];
    if (product.images.length > 0) return product.images;
    return product.featuredImage ? [product.featuredImage] : [];
  }, [product]);

  // Selecting a colour (or any variant with its own image) swaps the main mockup.
  // ponytail: if the variant image isn't part of the gallery we keep the current
  // image rather than appending an orphan; Shopify variant images are normally in the set.
  const variantImageUrl = selectedVariant?.image?.url;
  useEffect(() => {
    if (!variantImageUrl) return;
    const index = galleryImages.findIndex((image) => image.url === variantImageUrl);
    if (index >= 0) setActiveIndex(index);
  }, [variantImageUrl, galleryImages]);

  const chooseOption = useCallback((name: string, value: string) => {
    setSelected((prev) => ({ ...prev, [name]: value }));
    setStatusMessage(null);
  }, []);

  const showImage = useCallback(
    (index: number) => {
      const count = galleryImages.length;
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [galleryImages.length],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (galleryImages.length < 2) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(activeIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(activeIndex - 1);
      }
    },
    [activeIndex, galleryImages.length, showImage],
  );

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      if (Math.abs(deltaX) > 40) showImage(activeIndex + (deltaX < 0 ? 1 : -1));
      touchStartX.current = null;
    },
    [activeIndex, showImage],
  );

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    const ok = await addLines([{ merchandiseId: selectedVariant.id, quantity }]);
    setStatusMessage(ok ? s.shopAddedToCart : s.shopUpdateError);
    setIsAdding(false);
  }, [addLines, quantity, s.shopAddedToCart, s.shopUpdateError, selectedVariant]);

  const soldOut = Boolean(selectedVariant && !selectedVariant.availableForSale);
  const activeImage = galleryImages[activeIndex] ?? null;
  const hasMultipleImages = galleryImages.length > 1;

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
              <div
                className="pdp-main-media"
                role="group"
                aria-label={product.title}
                aria-roledescription="carousel"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {activeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeImage.url}
                    alt={activeImage.altText || product.title}
                    className="pdp-main-image"
                    draggable={false}
                  />
                ) : (
                  <div className="pdp-main-image pdp-main-fallback" aria-hidden />
                )}

                {hasMultipleImages ? (
                  <>
                    <button
                      type="button"
                      className="pdp-nav pdp-nav-prev"
                      aria-label={s.shopPrevImage}
                      onClick={() => showImage(activeIndex - 1)}
                    >
                      <span aria-hidden>‹</span>
                    </button>
                    <button
                      type="button"
                      className="pdp-nav pdp-nav-next"
                      aria-label={s.shopNextImage}
                      onClick={() => showImage(activeIndex + 1)}
                    >
                      <span aria-hidden>›</span>
                    </button>
                  </>
                ) : null}
              </div>

              {hasMultipleImages ? (
                <div className="pdp-thumbs" role="list">
                  {galleryImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.url}
                      className={`pdp-thumb ${index === activeIndex ? "is-active" : ""}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={image.altText || product.title}
                      aria-current={index === activeIndex}
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
                  <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="+">
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

            {product.descriptionHtml ? (
              <div
                className="pdp-details pdp-description rich-text"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : product.description ? (
              <p className="pdp-details pdp-description">{product.description}</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
