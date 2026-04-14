// ============================================
// Cart Context - Shopping cart state management
// ============================================

import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Medicine } from "@/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((medicine: Medicine, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicine.id);
      if (existing) {
        return prev.map((i) =>
          i.medicine.id === medicine.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { medicine, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setItems((prev) => prev.filter((i) => i.medicine.id !== medicineId));
  }, []);

  const updateQuantity = useCallback((medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.medicine.id !== medicineId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.medicine.id === medicineId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
