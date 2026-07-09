"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatShopifyMoney } from "@/lib/format-shopify-money";
import type { ShopifyProductCard } from "@/lib/shopify-types";
import { useLanguage } from "@/context/LanguageContext";

type ShopifyProductCarouselProps = {
  id: string;
  title: string;
  products: ShopifyProductCard[];
  productPathPrefix: string;
  viewDetailsText: string;
  prevLabel: string;
  nextLabel: string;
};

export function ShopifyProductCarousel({
  id,
  title,
  products,
  productPathPrefix,
  viewDetailsText,
  prevLabel,
  nextLabel,
}: ShopifyProductCarouselProps) {
  const { lang } = useLanguage();
  const priceLocale = lang === "he" ? "he-IL" : "en-IL";
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollPrev(scrollLeft > 4);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [products, updateScrollState]);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>(".store-carousel-card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const step = (firstCard?.offsetWidth ?? 280) + gap;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="store-carousel-section" aria-labelledby={id}>
      <div className="store-carousel-header">
        <h2 className="store-carousel-title" id={id}>
          {title}
        </h2>
        <div className="store-carousel-nav">
          <button
            type="button"
            className="store-carousel-btn"
            aria-label={prevLabel}
            disabled={!canScrollPrev}
            onClick={() => scrollByPage(-1)}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            className="store-carousel-btn"
            aria-label={nextLabel}
            disabled={!canScrollNext}
            onClick={() => scrollByPage(1)}
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="store-carousel-track"
        role="list"
        aria-label={title}
        tabIndex={0}
      >
        {products.map((product) => (
          <article className="store-card store-carousel-card" key={product.id} role="listitem">
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
                    ? formatShopifyMoney(product.minPrice.amount, product.minPrice.currencyCode, priceLocale)
                    : ""}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
