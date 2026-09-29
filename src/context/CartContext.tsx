import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'testimony_store_cart_v1';
const FREE_SHIPPING_THRESHOLD = 150000; // Free delivery for orders ₦150,000 and above
const STANDARD_SHIPPING_FEE = 4500;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(product.stockCount || 99, next[existingIndex].quantity + quantity),
          selectedColor: selectedColor || next[existingIndex].selectedColor,
          selectedSize: selectedSize || next[existingIndex].selectedSize,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stockCount || 99;
          return { ...item, quantity: Math.min(max, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TESTIMONY10' || clean === 'WELCOME10' || clean === 'MONIEPOINT') {
      setCouponCode(clean);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const discountAmount = couponCode ? Math.round(subtotal * 0.10) : 0;
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        shippingFee,
        total,
        isCartOpen,
        setIsCartOpen,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
