"use client";

import { useCallback, useEffect, useState } from "react";
import { cartLinesRemove, cartLinesUpdate, getCart, getStoredCartId, setStoredCartId } from "@/lib/shopify-cart";
import type { ShopifyCart } from "@/lib/shopify-types";

export const SHOPIFY_CART_REFRESH_EVENT = "shopify-cart-refresh";

type ShopifyCartPanelProps = {
  title: string;
  emptyText: string;
  checkoutLabel: string;
  loadingText: string;
  updateErrorText: string;
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

export function ShopifyCartPanel({
  title,
  emptyText,
  checkoutLabel,
  loadingText,
  updateErrorText,
}: ShopifyCartPanelProps) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    const cartId = getStoredCartId();
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const currentCart = await getCart(cartId);
      if (currentCart) {
        setStoredCartId(currentCart.id);
      }
      setCart(currentCart);
      setError(null);
    } catch {
      setError(updateErrorText);
    } finally {
      setLoading(false);
    }
  }, [updateErrorText]);

  useEffect(() => {
    void refreshCart();

    const onRefresh = () => {
      void refreshCart();
    };

    window.addEventListener(SHOPIFY_CART_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(SHOPIFY_CART_REFRESH_EVENT, onRefresh);
  }, [refreshCart]);

  const handleChangeQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      const cartId = cart?.id ?? getStoredCartId();
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await cartLinesUpdate(cartId, [{ id: lineId, quantity }]);
        setStoredCartId(updatedCart.id);
        setCart(updatedCart);
        setError(null);
      } catch {
        setError(updateErrorText);
      } finally {
        setLoading(false);
      }
    },
    [cart?.id, updateErrorText],
  );

  const handleRemoveLine = useCallback(
    async (lineId: string) => {
      const cartId = cart?.id ?? getStoredCartId();
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await cartLinesRemove(cartId, [lineId]);
        setStoredCartId(updatedCart.id);
        setCart(updatedCart);
        setError(null);
      } catch {
        setError(updateErrorText);
      } finally {
        setLoading(false);
      }
    },
    [cart?.id, updateErrorText],
  );

  return (
    <aside className="shirts-store-panel shopify-cart-panel" aria-live="polite">
      <h2 className="subtitle">{title}</h2>
      {loading ? <p className="subtitle">{loadingText}</p> : null}
      {!loading && (!cart || cart.lines.length === 0) ? <p className="subtitle">{emptyText}</p> : null}
      {error ? <p className="subtitle">{error}</p> : null}

      {cart && cart.lines.length > 0 ? (
        <>
          <ul className="shopify-cart-list">
            {cart.lines.map((line) => (
              <li key={line.id} className="shopify-cart-line">
                <div className="shopify-cart-line-copy">
                  <p className="shopify-cart-line-title">{line.productTitle}</p>
                  <p className="shopify-cart-line-meta">{line.variantTitle}</p>
                  <p className="shopify-cart-line-meta">{formatMoney(line.price.amount, line.price.currencyCode)}</p>
                </div>
                <div className="shopify-cart-line-controls">
                  <button
                    type="button"
                    className="button"
                    onClick={() => void handleChangeQuantity(line.id, Math.max(1, line.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    className="button"
                    onClick={() => void handleChangeQuantity(line.id, line.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => void handleRemoveLine(line.id)}
                    aria-label="Remove line"
                  >
                    x
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="shopify-cart-footer">
            {cart.subtotal ? (
              <p className="subtitle">
                {formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}
              </p>
            ) : null}
            <a href={cart.checkoutUrl} className="button button-primary shirts-store-button">
              {checkoutLabel}
            </a>
          </div>
        </>
      ) : null}
    </aside>
  );
}
