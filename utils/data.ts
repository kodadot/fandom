import useSWR, { mutate } from "swr";
import { Image, Money } from "./types.ts";
import { $purify } from 'https://esm.sh/@kodadot1/minipfs@0.2.0-rc.0'

export interface GithubData {
  watchers: number
}

export interface CartData {
  id: string;
  lines: {
    nodes: {
      id: string;
      quantity: number;
      merchandise: {
        product: {
          title: string;
        };
        title: string;
        image: Image;
      };
      estimatedCost: {
        totalAmount: Money;
      };
    }[];
  };
  checkoutUrl: string;
  estimatedCost: {
    totalAmount: Money;
  };
}

const CART_QUERY = `{
  id
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ...on ProductVariant {
          title
          image {
            url
            altText
          }
          product {
            title
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
  checkoutUrl
  estimatedCost {
    totalAmount {
      amount
      currencyCode
    }
  }
}`;

// deno-lint-ignore no-explicit-any
async function shopifyGraphql<T = any>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch("/api/shopify", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}

async function cartFetcher(): Promise<CartData> {
  const id = localStorage.getItem("cartId");
  if (id === null) {
    const { cartCreate } = await shopifyGraphql<
      { cartCreate: { cart: CartData } }
    >(`mutation { cartCreate { cart ${CART_QUERY} } }`);
    localStorage.setItem("cartId", cartCreate.cart.id);
    return cartCreate.cart;
  }

  const { cart } = await shopifyGraphql(
    `query($id: ID!) { cart(id: $id) ${CART_QUERY} }`,
    { id },
  );
  if (cart === null) {
    // If there is a cart ID, but the returned cart is null, then the cart
    // was already part of a completed order. Clear the cart ID and get a new
    // one.
    localStorage.removeItem("cartId");
    return cartFetcher();
  }

  return cart;
}

async function githubApiFetcher(): Promise<GithubData> {
  const res = await fetch("https://api.github.com/repos/kodadot/nft-gallery");
  return await res.json();
}

export function useStargazers() {
  return useSWR<GithubData, Error>("watchers", githubApiFetcher);
}

export function useCart() {
  return useSWR<CartData, Error>("cart", cartFetcher, { keepPreviousData: true });
}

const ADD_TO_CART_QUERY =
  `mutation add($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart ${CART_QUERY}
  }
}`;

export async function addToCart(cartId: string, productId: string) {
  const mutation = shopifyGraphql<{ cart: CartData }>(ADD_TO_CART_QUERY, {
    cartId,
    lines: [{ merchandiseId: productId }],
  }).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

const REMOVE_FROM_CART_MUTATION = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart ${CART_QUERY}
    }
  }
`;

export async function removeFromCart(cartId: string, lineItemId: string) {
  const mutation = shopifyGraphql<{ cart: CartData }>(
    REMOVE_FROM_CART_MUTATION,
    {
      cartId,
      lineIds: [lineItemId],
    },
  ).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

export function formatCurrency(amount: Money) {
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.currencyCode,
  });
  return intl.format(amount.amount);
}

export function formatBalance(amount?: bigint | string) {
  const value = BigInt(amount || BigInt(0));
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: 'KSM',
  });
  return intl.format(value / BigInt(1e12));
}

export function sanitizeUri(uri?: string) {
  return uri ? $purify(uri).at(0) : ''
}

export function shortAddress(
  address: string,
  begin?: number,
  end?: number
): string {
  begin = begin ? begin : 6
  end = end ? end : -6

  if (address) {
    return `${address.slice(0, begin)}...${address.slice(end)}`
  }
  return ''
}
