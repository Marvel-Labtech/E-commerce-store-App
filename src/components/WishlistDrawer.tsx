import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface WishlistDrawerProps {
  onSelectProduct: (product: any) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onSelectProduct }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h2 className="font-bold text-slate-900 text-base">Your Wishlist</h2>
            <span className="text-xs text-slate-500 font-mono">({wishlist.length} saved)</span>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  clearWishlist();
                  showToast('Wishlist cleared', 'info');
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-900 text-base mb-1">Your wishlist is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Tap the heart icon on any product to save it here for later.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="py-4 first:pt-0 last:pb-0 flex gap-3 cursor-pointer group"
                onClick={() => {
                  setIsWishlistOpen(false);
                  onSelectProduct(product);
                }}
              >
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider">
                      {product.brand}
                    </p>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {formatNaira(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        showToast(`Added ${product.name} to cart`, 'success');
                      }}
                      disabled={!product.inStock}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        product.inStock
                          ? 'bg-slate-900 hover:bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(product);
                        showToast('Removed from wishlist', 'info');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                wishlist.forEach((p) => {
                  if (p.inStock) addToCart(p, 1);
                });
                showToast('All in-stock wishlist items added to cart', 'success');
                setIsWishlistOpen(false);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All Available to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
