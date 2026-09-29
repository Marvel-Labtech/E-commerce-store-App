import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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
    freeShippingThreshold,
  } = useCart();

  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      showToast(`Coupon applied! 10% discount subtracted.`, 'success');
      setCouponInput('');
    } else {
      showToast(`Invalid coupon code. Try TESTIMONY10`, 'error');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Your Cart</h2>
            <span className="text-xs text-slate-600 font-mono">({itemCount} items)</span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  clearCart();
                  showToast('Cart cleared', 'info');
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-indigo-50/70 px-5 py-2.5 border-b border-indigo-100 text-xs text-indigo-900">
          {freeShippingRemaining > 0 ? (
            <div>
              <span>Add </span>
              <strong className="font-mono">{formatNaira(freeShippingRemaining)}</strong>
              <span> more for <strong>FREE Nationwide Delivery</strong></span>
              <div className="w-full h-1.5 bg-indigo-200/60 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked FREE Nationwide Delivery!</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-900 text-base mb-1">Your cart is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our catalog of 500+ premium electronics, fashion, beauty, and essentials.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider">
                        {item.product.brand}
                      </p>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold font-mono tabular-nums text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        {formatNaira(item.product.price * item.quantity)}
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono tabular-nums">
                        {formatNaira(item.product.price)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. TESTIMONY10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>

            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span>Code <strong>{couponCode}</strong> applied (10% OFF)</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900">{formatNaira(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount (10%)</span>
                  <span className="font-mono tabular-nums">-{formatNaira(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatNaira(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-indigo-700 text-base">
                  {formatNaira(total)}
                </span>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="text-[11px] text-slate-700 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Payment via <strong>Moniepoint Direct Bank Transfer</strong> with instant verification.
              </span>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
