import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product } from "../types";
import toast from "react-hot-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("shopnest_cart") || "[]"); } catch { return []; }
  });

  const save = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("shopnest_cart", JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...prev, {
          productId: product._id,
          name: product.name,
          image: product.images[0] || "",
          price: product.price,
          quantity,
        }];
      }
      localStorage.setItem("shopnest_cart", JSON.stringify(updated));
      return updated;
    });
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId: string) => {
    save(cart.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    save(cart.map((i) => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => save([]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
