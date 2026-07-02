"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";

function formatMoney(amount: string, currencyCode: string) {
  const numeric = Number.parseFloat(amount);
  if (!Number.isFinite(numeric)) return `${amount} ${currencyCode}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function CartDrawer() {
  const { cart, count, loading, error, isOpen, closeCart, updateLine, removeLine } = useCart();
  const { lang } = useLanguage();
  const s = useTranslation(lang);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines ?? [];
  const hasItems = lines.length > 0;

  return (
    <div className={`cart-drawer-root ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <button
        type="button"
        className="cart-drawer-overlay"
        aria-label={s.shopCartClose}
        tabIndex={isOpen ? 0 : -1}
        onClick={closeCart}
      />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={s.shopCartTitle}
      >
        <header className="cart-drawer-head">
          <h2 className="cart-drawer-title">
            {s.shopCartTitle}
            {count > 0 ? <span className="cart-drawer-count">{count}</span> : null}
          </h2>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label={s.shopCartClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="cart-drawer-body">
          {error ? <p className="cart-drawer-note">{s.shopUpdateError}</p> : null}
          {!hasItems && !loading ? (
            <div className="cart-drawer-empty">
              <p className="cart-drawer-empty-text">{s.shopCartEmpty}</p>
              <button type="button" className="button button-ghost" onClick={closeCart}>
                {s.shopContinueShopping}
              </button>
            </div>
          ) : null}

          {hasItems ? (
            <ul className="cart-drawer-list">
              {lines.map((line) => (
                <li key={line.id} className="cart-drawer-line">
                  <div className="cart-drawer-thumb" aria-hidden>
                    {line.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.image.url} alt="" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="cart-drawer-line-main">
                    <p className="cart-drawer-line-title">{line.productTitle}</p>
                    {line.variantTitle && line.variantTitle !== "Default Title" ? (
                      <p className="cart-drawer-line-variant">{line.variantTitle}</p>
                    ) : null}
                    <div className="cart-drawer-stepper" role="group" aria-label={s.shopQuantity}>
                      <button
                        type="button"
                        onClick={() => void updateLine(line.id, line.quantity - 1)}
                        aria-label="−"
                        disabled={loading}
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => void updateLine(line.id, line.quantity + 1)}
                        aria-label="+"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-drawer-line-side">
                    <p className="cart-drawer-line-price">
                      {formatMoney(line.price.amount, line.price.currencyCode)}
                    </p>
                    <button
                      type="button"
                      className="cart-drawer-remove"
                      onClick={() => void removeLine(line.id)}
                      disabled={loading}
                    >
                      {s.shopRemove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {hasItems ? (
          <footer className="cart-drawer-foot">
            <div className="cart-drawer-subtotal">
              <span>{s.shopSubtotal}</span>
              {cart?.subtotal ? (
                <span>{formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}</span>
              ) : null}
            </div>
            <p className="cart-drawer-tax">{s.shopTaxNote}</p>
            <a href={cart?.checkoutUrl} className="button button-primary cart-drawer-checkout">
              {s.shopCheckout}
            </a>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
