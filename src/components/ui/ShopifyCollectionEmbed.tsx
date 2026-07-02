"use client";

import { useEffect, useId } from "react";

type ShopifyCollectionEmbedProps = {
  collectionId: string;
};

type ShopifyBuyUi = {
  createComponent: (type: string, config: Record<string, unknown>) => void;
};

type ShopifyBuyGlobal = {
  UI?: {
    onReady: (client: unknown) => Promise<ShopifyBuyUi>;
  };
  buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
};

declare global {
  interface Window {
    ShopifyBuy?: ShopifyBuyGlobal;
  }
}

const SHOPIFY_BUY_BUTTON_SDK_URL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

const SHOPIFY_COLLECTION_OPTIONS = {
  product: {
    styles: {
      product: {
        "@media (min-width: 601px)": {
          maxWidth: "calc(25% - 20px)",
          marginLeft: "20px",
          marginBottom: "50px",
          width: "calc(25% - 20px)",
        },
        img: {
          height: "calc(100% - 15px)",
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
        },
        imgWrapper: {
          paddingTop: "calc(75% + 15px)",
          position: "relative",
          height: "0",
        },
      },
      button: {
        fontWeight: "bold",
        ":hover": { backgroundColor: "#1b8938" },
        backgroundColor: "#1e983e",
        ":focus": { backgroundColor: "#1b8938" },
        borderRadius: "32px",
      },
    },
    text: {
      button: "Add to cart",
    },
  },
  productSet: {
    styles: {
      products: {
        "@media (min-width: 601px)": {
          marginLeft: "-20px",
        },
      },
    },
  },
  modalProduct: {
    contents: {
      img: false,
      imgWithCarousel: true,
      button: false,
      buttonWithQuantity: true,
    },
    styles: {
      product: {
        "@media (min-width: 601px)": {
          maxWidth: "100%",
          marginLeft: "0px",
          marginBottom: "0px",
        },
      },
      button: {
        fontWeight: "bold",
        ":hover": { backgroundColor: "#1b8938" },
        backgroundColor: "#1e983e",
        ":focus": { backgroundColor: "#1b8938" },
        borderRadius: "32px",
      },
    },
    text: {
      button: "Add to cart",
    },
  },
  option: {},
  cart: {
    styles: {
      button: {
        fontWeight: "bold",
        ":hover": { backgroundColor: "#1b8938" },
        backgroundColor: "#1e983e",
        ":focus": { backgroundColor: "#1b8938" },
        borderRadius: "32px",
      },
    },
    text: {
      total: "Subtotal",
      button: "Checkout",
    },
  },
  toggle: {
    styles: {
      toggle: {
        fontWeight: "bold",
        backgroundColor: "#1e983e",
        ":hover": { backgroundColor: "#1b8938" },
        ":focus": { backgroundColor: "#1b8938" },
      },
    },
  },
};

function ensureShopifyBuyLoaded(): Promise<ShopifyBuyGlobal> {
  if (window.ShopifyBuy?.UI) return Promise.resolve(window.ShopifyBuy);

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.ShopifyBuy) resolve(window.ShopifyBuy);
      });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Shopify Buy Button SDK.")));
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = SHOPIFY_BUY_BUTTON_SDK_URL;
    script.onload = () => {
      if (window.ShopifyBuy) {
        resolve(window.ShopifyBuy);
      } else {
        reject(new Error("Shopify Buy Button SDK loaded but window.ShopifyBuy is missing."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Shopify Buy Button SDK."));
    document.head.appendChild(script);
  });
}

export function ShopifyCollectionEmbed({ collectionId }: ShopifyCollectionEmbedProps) {
  const rawId = useId();
  const containerId = `shopify-collection-${rawId.replaceAll(":", "")}`;

  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
    if (!domain || !storefrontAccessToken || !collectionId) return;

    let cancelled = false;

    void ensureShopifyBuyLoaded()
      .then((shopifyBuy) => {
        if (cancelled || !shopifyBuy.UI) return;

        const client = shopifyBuy.buildClient({ domain, storefrontAccessToken });
        return shopifyBuy.UI.onReady(client);
      })
      .then((ui) => {
        if (!ui || cancelled) return;
        const node = document.getElementById(containerId);
        if (!node) return;
        node.innerHTML = "";
        ui.createComponent("collection", {
          id: collectionId,
          node,
          moneyFormat: "%7B%7Bamount%7D%7D%20NIS",
          options: SHOPIFY_COLLECTION_OPTIONS,
        });
      })
      .catch(() => {
        // ponytail: silent fail keeps the manual "open store" fallback usable.
      });

    return () => {
      cancelled = true;
    };
  }, [collectionId, containerId]);

  return <div id={containerId} className="shopify-collection-embed" />;
}
