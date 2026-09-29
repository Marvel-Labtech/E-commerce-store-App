import React, { useState } from 'react';
import { Product } from '../types';
import { formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { STORE_BANK_DETAILS } from '../data/categories';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  MessageCircle,
  Plus,
  Minus,
  Check,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelated: (product: Product) => void;
  relatedProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectRelated,
  relatedProducts,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  // Sync state when product changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setImageError(false);
    if (product) {
      setLocalReviews(product.reviews || []);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id);
  const activeImage = product.gallery[selectedImageIndex] || product.image;

  const handleAddToCart = () => {
    if (!product.inStock) {
      showToast('This item is currently out of stock', 'error');
      return;
    }
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.name} to cart`, 'success');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed from wishlist` : `Saved ${product.name} to wishlist`,
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-user-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast('Your review was published successfully!', 'success');
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Gideon, I'm interested in purchasing "${product.name}" (${formatNaira(
        product.price
      )}) from Testimony Store. Is it available for immediate dispatch?`
    );
    window.open(`https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <span>{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 truncate">{product.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
              }`}
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="flex flex-col gap-3">
              {/* Main Image Viewport */}
              <div className="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                {!imageError ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4">
                    <ShoppingBag className="w-12 h-12 mb-2 text-indigo-400 opacity-60" />
                    <span className="text-xs font-semibold text-slate-500">{product.brand}</span>
                  </div>
                )}

                {/* Stock Tag */}
                <div className="absolute top-3 left-3">
                  {product.inStock ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide">
                      In Stock ({product.stockCount} units available)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600/90 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails list */}
              {product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((imgUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setImageError(false);
                      }}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === index
                          ? 'border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Purchase Module */}
            <div className="flex flex-col">
              {/* Brand & Subcategory unboxed metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-bold text-indigo-600 tracking-wider uppercase text-xs">
                  {product.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.subcategory}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">SKU: {product.id}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                {product.name}
              </h1>

              {/* Rating & Review summary */}
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold text-slate-900 tabular-nums text-sm">
                    {product.rating}
                  </span>
                </div>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{localReviews.length} customer reviews</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine
                </span>
              </div>

              {/* Price Banner */}
              <div className="mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                    {formatNaira(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 font-mono line-through tabular-nums">
                      {formatNaira(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Direct Bank Transfer to <strong>Moniepoint</strong> available on checkout.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity Stepper & Buy Actions */}
              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-bold font-mono text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stockCount || 99, q + 1))
                      }
                      className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                      product.inStock
                        ? 'bg-slate-900 hover:bg-indigo-600 text-white active:scale-98'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.inStock ? `Add to Cart (${quantity})` : 'Out of Stock'}</span>
                  </button>
                </div>

                {/* WhatsApp Quick Order button */}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order or Ask via WhatsApp with Gideon</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <Truck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 block">Fast Nationwide</span>
                  <span className="text-[9px] text-slate-600">Dispatch in 24h</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 block">Moniepoint Verified</span>
                  <span className="text-[9px] text-slate-600">Secure Direct Transfer</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <RotateCcw className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 block">Original Warranty</span>
                  <span className="text-[9px] text-slate-600">Guaranteed Brand New</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Product Specifications & Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Customer Reviews ({localReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating} out of 5.0</span>
              </div>
            </div>

            {/* Existing reviews */}
            <div className="space-y-3 mb-6">
              {localReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a review form */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Leave a Verified Review
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Adebayo O.)"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Your Rating:</span>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Share your experience with this product, delivery speed, and customer service..."
                rows={2}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="group cursor-pointer flex flex-col bg-slate-50 rounded-xl p-2.5 hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-200 mb-2">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                      {rel.brand}
                    </span>
                    <h5 className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {rel.name}
                    </h5>
                    <span className="text-xs font-bold font-mono text-slate-900 mt-1">
                      {formatNaira(rel.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
