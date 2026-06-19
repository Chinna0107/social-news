import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Omit<CartItem, "qty">) => {
    const normalized = { ...product, price: Number(product.price) };
    setItems(prev => {
      const existing = prev.find(i => i._id === normalized._id);
      if (existing) return prev.map(i => i._id === normalized._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...normalized, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeFromCart(id); return; }
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
