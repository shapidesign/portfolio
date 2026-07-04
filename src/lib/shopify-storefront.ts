import type { ShopifyCollectionProducts, ShopifyImage, ShopifyMoney, ShopifyProductCard, ShopifyProductDetail, ShopifyVariant } from "@/lib/shopify-types";

const DEFAULT_SHOPIFY_DOMAIN = "mundial-laundry.myshopify.com";
// ponytail: public Storefront API token (safe to expose in the client bundle by design);
// upgrade path is setting NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in Vercel and rotating the token.
const DEFAULT_SHOPIFY_STOREFRONT_TOKEN = "7a9042e0b5103720e527af98496f694b";
const DEFAULT_SHIRTS_COLLECTION_HANDLE = "shirts";

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyGraphQLResponse<TData> = {
  data?: TData;
  errors?: ShopifyGraphQLError[];
};

function getStorefrontConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? DEFAULT_SHOPIFY_DOMAIN;
  const storefrontAccessToken =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? DEFAULT_SHOPIFY_STOREFRONT_TOKEN;
  const shirtsCollectionHandle =
    process.env.NEXT_PUBLIC_SHOPIFY_SHIRTS_COLLECTION_HANDLE ??
    process.env.NEXT_PUBLIC_SHOPIFY_SHIRTS_HANDLE ??
    DEFAULT_SHIRTS_COLLECTION_HANDLE;
  const merchCollectionHandle =
    process.env.NEXT_PUBLIC_SHOPIFY_MERCH_COLLECTION_HANDLE ??
    process.env.NEXT_PUBLIC_SHOPIFY_MERCH_HANDLE ??
    shirtsCollectionHandle;

  return { domain, storefrontAccessToken, shirtsCollectionHandle, merchCollectionHandle };
}

function mapImage(image: {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
} | null): ShopifyImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText ?? "",
    width: image.width,
    height: image.height,
  };
}

function mapMoney(money: { amount: string; currencyCode: string } | null): ShopifyMoney | null {
  if (!money) return null;
  return {
    amount: money.amount,
    currencyCode: money.currencyCode,
  };
}

function mapProductCard(product: {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string } | null;
  } | null;
  collections?: { edges: Array<{ node: { handle: string } }> };
}): ShopifyProductCard {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: mapImage(product.featuredImage),
    minPrice: mapMoney(product.priceRange?.minVariantPrice ?? null),
    collectionHandles: product.collections?.edges.map(({ node }) => node.handle) ?? [],
  };
}

function mapVariant(variant: {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
  image: { url: string; altText: string | null; width: number | null; height: number | null } | null;
}): ShopifyVariant {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    price: {
      amount: variant.price.amount,
      currencyCode: variant.price.currencyCode,
    },
    selectedOptions: variant.selectedOptions.map((option) => ({
      name: option.name,
      value: option.value,
    })),
    image: mapImage(variant.image),
  };
}

/** Map our app language to a Shopify Storefront LanguageCode. */
function toLanguageCode(lang?: string): "EN" | "HE" {
  return lang === "he" ? "HE" : "EN";
}

export async function queryStorefront<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
  const { domain, storefrontAccessToken } = getStorefrontConfig();
  if (!storefrontAccessToken) {
    throw new Error("Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN. Add it to your environment variables.");
  }
  const response = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    // Always reflect the latest Shopify catalog (Printify -> Shopify -> site) on every
    // page load; never serve a cached product list, price, or availability.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront request failed (${response.status}).`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(" "));
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront returned no data.");
  }

  return payload.data;
}

const ALL_PRODUCTS_QUERY = `
  query AllProducts($limit: Int!) {
    products(first: $limit, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          collections(first: 10) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!, $language: LanguageCode!) @inContext(language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

type AllProductsQueryResult = {
  products: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        title: string;
        featuredImage: {
          url: string;
          altText: string | null;
          width: number | null;
          height: number | null;
        } | null;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string } | null;
        } | null;
        collections: { edges: Array<{ node: { handle: string } }> };
      };
    }>;
  };
};

type ProductImageNode = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type ProductByHandleQueryResult = {
  product: {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    featuredImage: ProductImageNode | null;
    images: {
      edges: Array<{
        node: ProductImageNode;
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
          selectedOptions: Array<{ name: string; value: string }>;
          image: ProductImageNode | null;
        };
      }>;
    };
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string } | null;
    } | null;
  } | null;
};

export async function getAllProducts(limit = 100): Promise<ShopifyProductCard[]> {
  const data = await queryStorefront<AllProductsQueryResult>(ALL_PRODUCTS_QUERY, { limit });
  return data.products.edges.map(({ node }) => mapProductCard(node));
}

export async function getCollectionProducts(handle: string, limit = 100): Promise<ShopifyCollectionProducts | null> {
  // The store is a single flat catalog, and curated collections (e.g. "shirts")
  // lag behind newly published Printify products, so they miss items like the
  // toddler tees and back-print designs. Always mirror the full catalog and let
  // the client group products into categories.
  // ponytail: if maintained, distinct collections are introduced later, branch
  // on `handle` here and query the collection directly again.
  const products = await getAllProducts(limit);
  return { handle, title: "", products };
}

export async function getProductByHandle(handle: string, lang?: string): Promise<ShopifyProductDetail | null> {
  const data = await queryStorefront<ProductByHandleQueryResult>(PRODUCT_BY_HANDLE_QUERY, {
    handle,
    language: toLanguageCode(lang),
  });
  const product = data.product;
  if (!product) return null;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    featuredImage: mapImage(product.featuredImage),
    images: product.images.edges.map(({ node }) => ({
      url: node.url,
      altText: node.altText ?? "",
      width: node.width,
      height: node.height,
    })),
    variants: product.variants.edges.map(({ node }) => mapVariant(node)),
    minPrice: mapMoney(product.priceRange?.minVariantPrice ?? null),
    collectionHandles: [],
  };
}

export function getDefaultCollectionHandles() {
  const { shirtsCollectionHandle, merchCollectionHandle } = getStorefrontConfig();
  return { shirtsCollectionHandle, merchCollectionHandle };
}
