import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, PackageCheck, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) {
      showToast('This item is currently out of stock', 'error');
      return;
    }
    addToCart(product, 1);
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed from wishlist` : `Saved ${product.name} to wishlist`,
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer text-left"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50/50 p-4 text-slate-400">
            <ShoppingBag className="w-10 h-10 mb-1 text-indigo-400 opacity-60" />
            <span className="text-[11px] font-medium text-slate-500">{product.brand}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-150 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quiet Editorial Stock Note on Media Overlay if Low or Out of Stock */}
        {!product.inStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-wide uppercase px-3 py-1 bg-rose-600/90 rounded-md">
              Out of Stock
            </span>
          </div>
        ) : product.stockCount <= 5 ? (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide">
            Only {product.stockCount} left
          </div>
        ) : null}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        {/* Unboxed Metadata Line with typographic separators (Zero-pill discipline) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
          <span className="font-semibold text-indigo-700 tracking-wider uppercase text-[11px]">
            {product.brand}
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="truncate max-w-[130px] text-slate-700">{product.subcategory}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
          {product.name}
        </h3>

        {/* Rating & Social Proof */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-semibold text-slate-800 tabular-nums">{product.rating}</span>
          </div>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-600">({product.reviewCount} reviews)</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums leading-none">
              {formatNaira(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-slate-600 font-mono tabular-nums line-through mt-0.5">
                {formatNaira(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              product.inStock
                ? 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
