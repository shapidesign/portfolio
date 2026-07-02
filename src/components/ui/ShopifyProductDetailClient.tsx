"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShopifyCartPanel, SHOPIFY_CART_REFRESH_EVENT } from "@/components/ui/ShopifyCartPanel";
import { cartCreate, cartLinesAdd, getStoredCartId, setStoredCartId } from "@/lib/shopify-cart";
import { getProductByHandle } from "@/lib/shopify-storefront";
import type { ShopifyProductDetail } from "@/lib/shopify-types";
import {
  defaultSelection,
  deriveOptions,
  isValueAvailable,
  resolveVariant,
  type SelectedOptions,
} from "@/lib/shopify-variants";
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
    try {
      const existingCartId = getStoredCartId();
      const line = { merchandiseId: selectedVariant.id, quantity };
      const cart = existingCartId ? await cartLinesAdd(existingCartId, [line]) : await cartCreate([line]);
      setStoredCartId(cart.id);
      window.dispatchEvent(new Event(SHOPIFY_CART_REFRESH_EVENT));
      setStatusMessage(s.shopAddedToCart);
    } catch {
      setStatusMessage(s.shopUpdateError);
    } finally {
      setIsAdding(false);
    }
  }, [quantity, s.shopAddedToCart, s.shopUpdateError, selectedVariant]);

  return (
    <main className="shirts-page">
      <section className="section content-wrap shirts-hero">
        <Link href={backHref} className="button">
          {s.shopBackToCollection}
        </Link>
      </section>
      <section className="section content-wrap shirts-store-section" aria-live="polite">
        {loading ? <p className="subtitle">{s.shopLoading}</p> : null}
        {error ? (
          <div className="shirts-store-panel">
            <p className="subtitle">{error}</p>
            <button type="button" className="button button-primary shirts-store-button" onClick={() => void loadProduct()}>
              {s.shopRetry}
            </button>
          </div>
        ) : null}
        {!loading && !error && !product ? <p className="subtitle">{s.shopProductNotFound}</p> : null}
        {product ? (
          <div className="shopify-product-detail-wrap">
            <article className="shirts-store-panel shopify-product-detail">
              <h1 className="text-display font-display">{product.title}</h1>
              {activeImageUrl ? (
                <img src={activeImageUrl} alt={product.title} className="shopify-product-main-image" />
              ) : null}
              {product.images.length > 1 ? (
                <div className="shopify-product-thumbs" role="list">
                  {product.images.map((image) => (
                    <button
                      type="button"
                      key={image.url}
                      className={`shopify-product-thumb ${activeImageUrl === image.url ? "is-active" : ""}`}
                      onClick={() => setActiveImageUrl(image.url)}
                    >
                      <img src={image.url} alt={image.altText || product.title} />
                    </button>
                  ))}
                </div>
              ) : null}
              <p>{product.description}</p>
              {selectedVariant?.price ? (
                <p className="shirts-card-price">
                  {formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                </p>
              ) : null}

              {options.map((option) => {
                const isColor = isColorOption(option.name);
                return (
                  <div key={option.name} className="shopify-option-group">
                    <span className="shopify-option-label">{option.name}</span>
                    <div className="shopify-option-values" role="group" aria-label={option.name}>
                      {option.values.map((value) => {
                        const available = isValueAvailable(product.variants, selected, option.name, value);
                        const isSelected = selected[option.name] === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            className={`shopify-option-pill ${isColor ? "is-swatch" : ""} ${
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
                                  className="shopify-color-swatch"
                                  style={{ backgroundColor: toCssColor(value) }}
                                  aria-hidden="true"
                                />
                                <span className="shopify-option-text">{value}</span>
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
              {selectedVariant && !selectedVariant.availableForSale ? (
                <p className="subtitle">{s.shopOptionUnavailable}</p>
              ) : null}

              <label className="shopify-field">
                <span>{s.shopQuantity}</span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
                />
              </label>

              <button
                type="button"
                className="button button-primary shirts-store-button"
                disabled={!selectedVariant || !selectedVariant.availableForSale || isAdding}
                onClick={() => void handleAddToCart()}
              >
                {isAdding ? s.shopAddingToCart : s.shopAddToCart}
              </button>
              {statusMessage ? <p className="subtitle">{statusMessage}</p> : null}
            </article>

            <ShopifyCartPanel
              title={s.shopCartTitle}
              emptyText={s.shopCartEmpty}
              checkoutLabel={s.shopCheckout}
              loadingText={s.shopLoading}
              updateErrorText={s.shopUpdateError}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
