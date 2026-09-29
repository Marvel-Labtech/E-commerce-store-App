import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useOrders } from '../context/OrderContext';
import { Product } from '../types';
import { formatNaira } from '../data/products';
import { STORE_BANK_DETAILS, CATEGORIES_DATA } from '../data/categories';
import {
  Search,
  ShoppingBag,
  Heart,
  X,
  Phone,
  MessageCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  Inbox,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenMerchantDesk: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  allProducts,
  onSelectProduct,
  onSelectCategory,
  onOpenMerchantDesk,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();
  const { orders, pendingVerificationCount } = useOrders();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Suggestions for auto-complete
  const suggestions = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close suggestions dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Trust Notice Banner */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">
              Direct Bank Transfer to <strong>Moniepoint (8132230017)</strong> · Instant Verification & Fast Nationwide Dispatch
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300 font-medium">
            <button
              onClick={onOpenMerchantDesk}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Received Orders ({orders.length})</span>
              {pendingVerificationCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <a
              href={`https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Hotline: {STORE_BANK_DETAILS.formattedWhatsApp}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark Element */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <a href="#" className="hover:opacity-95 transition-opacity">
              <Logo size="md" />
            </a>
          </div>

          {/* Real-Time Instant Search Bar with debounce & auto-complete suggestions */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search 500+ phones, laptops, sneakers, fragrances, essentials..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-600 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant auto-complete suggestions popup */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
                {suggestions.length > 0 ? (
                  <>
                    <div className="p-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Matching Products ({suggestions.length})
                    </div>
                    {suggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          setIsSearchFocused(false);
                        }}
                        className="p-3 hover:bg-indigo-50/50 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span>{p.brand}</span>
                            <span aria-hidden="true">·</span>
                            <span>{p.subcategory}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-mono text-indigo-700 tabular-nums">
                          {formatNaira(p.price)}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No items found matching "{searchQuery}". Try searching for brands like Apple, Nike, Samsung, or general terms like hoodie or watch.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone 3: Primary Actions (Merchant Orders Desk, Wishlist & Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Merchant Received Orders Button */}
            <button
              onClick={onOpenMerchantDesk}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs"
              title="Where you receive all customer orders"
            >
              <Inbox className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Received Orders</span>
              <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums">
                {orders.length}
              </span>
            </button>

            {/* Mobile search toggle button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              aria-label="Open wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums font-bold">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search input expander */}
        {mobileSearchOpen && (
          <div className="pt-3 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search 500+ items..."
                className="w-full pl-9 pr-9 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Shortcut Strip */}
        <nav className="hidden lg:flex items-center gap-6 pt-3 mt-1 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => onSelectCategory('All')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            All Products (528)
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="hover:text-indigo-600 transition-colors whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={onOpenMerchantDesk}
              className="text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-200 transition-colors flex items-center gap-1.5"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Merchant Order Center</span>
            </button>
            <a
              href={`https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}?text=Hello%20Gideon,%20I'm%20inquiring%20about%20Testimony%20Store%20special%20deals`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Moniepoint Deals</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" showTagline />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Merchant Order Desk Shortcut */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMerchantDesk();
                }}
                className="w-full py-3 px-4 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  <span>Received Orders</span>
                </div>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono">
                  {orders.length}
                </span>
              </button>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Shop by Category
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-800"
                  >
                    All Products (528 items)
                  </button>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.name);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Moniepoint Bank Transfer
                </p>
                <p className="text-slate-600 text-[11px]">
                  Account: <strong>8132230017</strong> (Gideon John Mayowa)
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <a
                href={`https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Gideon on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
