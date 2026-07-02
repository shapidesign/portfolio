"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  cartCreate,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  getCart,
  getStoredCartId,
  setStoredCartId,
} from "@/lib/shopify-cart";
import type { ShopifyCart } from "@/lib/shopify-types";

type CartLineInput = { merchandiseId: string; quantity: number };

type CartContextValue = {
  cart: ShopifyCart | null;
  count: number;
  loading: boolean;
  error: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLines: (lines: CartLineInput[]) => Promise<boolean>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    const id = getStoredCartId();
    if (!id) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const next = await getCart(id);
      if (next) setStoredCartId(next.id);
      setCart(next);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addLines = useCallback(async (lines: CartLineInput[]) => {
    setLoading(true);
    try {
      const id = getStoredCartId();
      const next = id ? await cartLinesAdd(id, lines) : await cartCreate(lines);
      setStoredCartId(next.id);
      setCart(next);
      setError(false);
      setOpen(true);
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const mutateLines = useCallback(
    async (run: (cartId: string) => Promise<ShopifyCart>) => {
      const id = cart?.id ?? getStoredCartId();
      if (!id) return;
      setLoading(true);
      try {
        const next = await run(id);
        setStoredCartId(next.id);
        setCart(next);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [cart?.id],
  );

  const updateLine = useCallback(
    (lineId: string, quantity: number) =>
      quantity <= 0
        ? mutateLines((id) => cartLinesRemove(id, [lineId]))
        : mutateLines((id) => cartLinesUpdate(id, [{ id: lineId, quantity }])),
    [mutateLines],
  );

  const removeLine = useCallback(
    (lineId: string) => mutateLines((id) => cartLinesRemove(id, [lineId])),
    [mutateLines],
  );

  const count = useMemo(
    () => cart?.lines.reduce((total, line) => total + line.quantity, 0) ?? 0,
    [cart],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count,
      loading,
      error,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addLines,
      updateLine,
      removeLine,
    }),
    [cart, count, loading, error, isOpen, addLines, updateLine, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
