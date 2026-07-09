import { queryStorefront } from "@/lib/shopify-storefront";
import { convertMoney, refreshFxRates } from "@/lib/shopify-display-currency";
import type { ShopifyCart, ShopifyCartLine } from "@/lib/shopify-types";

export const SHOPIFY_CART_ID_STORAGE_KEY = "shopify-cart-id";

type CartInputLine = {
  merchandiseId: string;
  quantity: number;
};

type CartLineUpdate = {
  id: string;
  quantity: number;
};

type CartLineNode = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      featuredImage: {
        url: string;
        altText: string | null;
        width: number | null;
        height: number | null;
      } | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
};

type CartShape = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    } | null;
  } | null;
  lines: {
    edges: Array<{
      node: CartLineNode;
    }>;
  };
};

type CartMutationError = {
  message: string;
};

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 25) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              featuredImage {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

const CART_QUERY = `
  query Cart($id: ID!) {
    cart(id: $id) {
      ${CART_FIELDS}
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

function mapCartLine(node: CartLineNode): ShopifyCartLine {
  return {
    id: node.id,
    quantity: node.quantity,
    merchandiseId: node.merchandise.id,
    productTitle: node.merchandise.product.title,
    variantTitle: node.merchandise.title,
    image: node.merchandise.product.featuredImage
      ? {
          url: node.merchandise.product.featuredImage.url,
          altText: node.merchandise.product.featuredImage.altText ?? "",
          width: node.merchandise.product.featuredImage.width,
          height: node.merchandise.product.featuredImage.height,
        }
      : null,
    price: convertMoney({
      amount: node.merchandise.price.amount,
      currencyCode: node.merchandise.price.currencyCode,
    }),
  };
}

function mapCart(cart: CartShape): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost?.subtotalAmount
      ? convertMoney({
          amount: cart.cost.subtotalAmount.amount,
          currencyCode: cart.cost.subtotalAmount.currencyCode,
        })
      : null,
    lines: cart.lines.edges.map(({ node }) => mapCartLine(node)),
  };
}

function throwIfCartErrors(errors: CartMutationError[]) {
  if (errors.length === 0) return;
  throw new Error(errors.map((error) => error.message).join(" "));
}

async function finalizeCart(cart: CartShape): Promise<ShopifyCart> {
  await refreshFxRates();
  return mapCart(cart);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await queryStorefront<{ cart: CartShape | null }>(CART_QUERY, { id: cartId });
  if (!data.cart) return null;
  return finalizeCart(data.cart);
}

export async function cartCreate(lines: CartInputLine[] = []): Promise<ShopifyCart> {
  const data = await queryStorefront<{
    cartCreate: {
      cart: CartShape | null;
      userErrors: CartMutationError[];
    };
  }>(CART_CREATE_MUTATION, { lines });

  throwIfCartErrors(data.cartCreate.userErrors);

  if (!data.cartCreate.cart) throw new Error("Cart was not created.");
  return finalizeCart(data.cartCreate.cart);
}

export async function cartLinesAdd(cartId: string, lines: CartInputLine[]): Promise<ShopifyCart> {
  const data = await queryStorefront<{
    cartLinesAdd: {
      cart: CartShape | null;
      userErrors: CartMutationError[];
    };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });

  throwIfCartErrors(data.cartLinesAdd.userErrors);

  if (!data.cartLinesAdd.cart) throw new Error("Cart lines were not added.");
  return finalizeCart(data.cartLinesAdd.cart);
}

export async function cartLinesUpdate(cartId: string, lines: CartLineUpdate[]): Promise<ShopifyCart> {
  const data = await queryStorefront<{
    cartLinesUpdate: {
      cart: CartShape | null;
      userErrors: CartMutationError[];
    };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });

  throwIfCartErrors(data.cartLinesUpdate.userErrors);

  if (!data.cartLinesUpdate.cart) throw new Error("Cart lines were not updated.");
  return finalizeCart(data.cartLinesUpdate.cart);
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await queryStorefront<{
    cartLinesRemove: {
      cart: CartShape | null;
      userErrors: CartMutationError[];
    };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });

  throwIfCartErrors(data.cartLinesRemove.userErrors);

  if (!data.cartLinesRemove.cart) throw new Error("Cart lines were not removed.");
  return finalizeCart(data.cartLinesRemove.cart);
}

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SHOPIFY_CART_ID_STORAGE_KEY);
}

export function setStoredCartId(cartId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHOPIFY_CART_ID_STORAGE_KEY, cartId);
}

export function clearStoredCartId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SHOPIFY_CART_ID_STORAGE_KEY);
}
