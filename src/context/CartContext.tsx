"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { unitPrice } from "@/lib/data";

const STORAGE_KEY = "tua-cart";

type CartContextValue = {
  items: CartItem[];
  add: (product: Product, quantity?: number, size?: string) => void;
  remove: (productId: string, size?: string) => void;
  setQty: (productId: string, quantity: number, size?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = (product: Product, quantity = 1, size?: string) => {
    const price = unitPrice(product, size);
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: product.variantId,
          name: product.name,
          slug: product.slug,
          price,
          category: product.category,
          packaging: product.packaging,
          image: product.image,
          imageLabel: product.imageLabel ?? product.name,
          quantity,
          size,
        },
      ];
    });
    setOpen(true);
  };

  const remove = (productId: string, size?: string) =>
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );

  const setQty = (productId: string, quantity: number, size?: string) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.size === size))
        : prev.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i
          )
    );

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, count, subtotal, isOpen, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
