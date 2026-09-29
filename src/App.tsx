import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS, formatNaira } from './data/products';
import { CATEGORIES_DATA, STORE_BANK_DETAILS } from './data/categories';
import { Product, FilterState, Order, MainCategory } from './types';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { CategoryFilter } from './components/CategoryFilter';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceReceipt } from './components/InvoiceReceipt';
import { MerchantOrderDesk } from './components/MerchantOrderDesk';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Footer } from './components/Footer';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ShoppingBag,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  ChevronDown,
  Package,
  Inbox,
  MessageCircle,
  Mail,
  ArrowRight,
} from 'lucide-react';

const MAX_CATALOG_PRICE = 4000000;
const ITEMS_PER_PAGE = 24;

function StoreContent() {
  const { showToast } = useToast();
  const { orders, pendingVerificationCount, merchantSettings } = useOrders();

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    subcategory: 'All',
    priceRange: [0, MAX_CATALOG_PRICE],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'popularity',
  });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isMerchantDeskOpen, setIsMerchantDeskOpen] = useState(false);
  const [copiedBankInBanner, setCopiedBankInBanner] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSubcat = product.subcategory.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSubcat && !matchesTags) {
          return false;
        }
      }

      // Category
      if (filter.category !== 'All' && product.category !== filter.category) {
        return false;
      }

      // Subcategory
      if (filter.subcategory !== 'All' && product.subcategory !== filter.subcategory) {
        return false;
      }

      // Price Range
      if (product.price < filter.priceRange[0] || product.price > filter.priceRange[1]) {
        return false;
      }

      // Rating
      if (filter.minRating > 0 && product.rating < filter.minRating) {
        return false;
      }

      // Stock
      if (filter.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      if (filter.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      // Popularity (default)
      return b.reviewCount - a.reviewCount;
    });
  }, [filter]);

  // Related products for current selected detail modal
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return ALL_PRODUCTS.filter(
      (p) => p.subcategory === selectedProduct.subcategory && p.id !== selectedProduct.id
    ).slice(0, 4);
  }, [selectedProduct]);

  // Featured curated spotlight items
  const bestSellers = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setFilter((prev) => ({
      ...prev,
      category: categoryName as MainCategory | 'All',
      subcategory: 'All',
    }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleCopyBannerAccount = () => {
    navigator.clipboard.writeText(STORE_BANK_DETAILS.accountNumber);
    setCopiedBankInBanner(true);
    showToast('Moniepoint account number 8132230017 copied!', 'success');
    setTimeout(() => setCopiedBankInBanner(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        searchQuery={filter.searchQuery}
        onSearchChange={(q) => {
          setFilter((prev) => ({ ...prev, searchQuery: q }));
          setVisibleCount(ITEMS_PER_PAGE);
        }}
        allProducts={ALL_PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectCategory={handleCategorySelect}
        onOpenMerchantDesk={() => setIsMerchantDeskOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Top Hero Banner */}
        <HeroBanner
          onCategoryClick={(cat) => handleCategorySelect(cat)}
          onExploreClick={() => {
            const catalogEl = document.getElementById('catalog-section');
            catalogEl?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Quick Category Cards Carousel / Strip */}
        <section className="my-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Explore by Category
              </h2>
              <p className="text-xs text-slate-500">
                Browse our 5 core departments featuring 500+ genuine products
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              528 Catalog Items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = filter.category === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`group text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={cat.featuredImage}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {cat.name}
                    </h3>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {cat.subcategories.length} subcategories
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Moniepoint Direct Bank Transfer Feature Explainer */}
        <section className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Card Gateway Hassle · 100% Secure Transfer</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Direct Bank Transfer via Moniepoint Microfinance Bank
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enjoy instant order confirmation with zero card failure rates. Transfer directly to our dedicated business account and send your receipt or reference for 15-minute dispatch processing.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 w-full lg:w-auto shrink-0 space-y-3">
              <div className="text-xs text-indigo-200">
                <span>Bank: </span>
                <strong className="text-white">{STORE_BANK_DETAILS.bankName}</strong>
              </div>
              <div className="text-xs text-indigo-200">
                <span>Account Name: </span>
                <strong className="text-white">{STORE_BANK_DETAILS.accountName}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-indigo-300 uppercase tracking-wider block">
                    Account Number
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
                    {STORE_BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBannerAccount}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    copiedBankInBanner
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-indigo-950 hover:bg-amber-400'
                  }`}
                >
                  {copiedBankInBanner ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* WHERE YOU RECEIVE ORDERS - Merchant Command Hub Section */}
        <section className="my-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Inbox className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Store Owner Command Center
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Where You Receive Customer Orders
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every customer order is automatically captured and delivered through 3 connected channels in real time.
              </p>
            </div>

            <button
              onClick={() => setIsMerchantDeskOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Inbox className="w-4 h-4 text-amber-400" />
              <span>Open Merchant Order Desk ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {/* Channel 1: Real-time Order Desk */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                  Channel 1 · Primary Hub
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Live Merchant Order Desk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review incoming customer orders, view attached Moniepoint transfer receipt screenshots, copy customer dispatch addresses, and verify bank payments.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-indigo-700">
                {orders.length} orders recorded ({pendingVerificationCount} pending proof)
              </div>
            </div>

            {/* Channel 2: WhatsApp Direct Line */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Channel 2 · Instant Chat
                </span>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Merchant Line</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers receive an instant pre-formatted order summary ready to send straight to your personal WhatsApp line for quick 1-on-1 verification.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-emerald-800">
                {merchantSettings.receivingWhatsApp} (Gideon John Mayowa)
              </div>
            </div>

            {/* Channel 3: Email Notification */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  Channel 3 · Record Keeping
                </span>
                <Mail className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Email Notification Channel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order receipts, itemized invoices, and customer shipping particulars are formatted and preserved for accounting and logistics records.
              </p>
              <div className="pt-2 text-[11px] font-mono font-semibold text-slate-800 truncate">
                {merchantSettings.receivingEmail}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Best Sellers Showcase Carousel */}
        {filter.category === 'All' && !filter.searchQuery && (
          <section className="my-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Trending Bestsellers</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Customer favorites with highest ratings and verified purchases
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* MAIN PRODUCT CATALOG & FILTER SECTION */}
        <section id="catalog-section" className="pt-8">
          {/* Section Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {filter.category === 'All' ? 'All Products' : filter.category}
                {filter.subcategory !== 'All' && ` › ${filter.subcategory}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing <strong className="font-mono text-slate-800">{filteredProducts.length}</strong> items matching your criteria
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Filters</span>
              </button>

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                <select
                  value={filter.sortBy}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy'],
                    }))
                  }
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-xs"
                >
                  <option value="popularity">Sort: Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Layout: Sidebar + Product Grid */}
          <div className="flex gap-8 items-start">
            {/* Desktop Category Filter Sidebar */}
            <CategoryFilter
              filter={filter}
              setFilter={setFilter}
              totalResults={filteredProducts.length}
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
              maxCatalogPrice={MAX_CATALOG_PRICE}
            />

            {/* Product Grid Area */}
            <div className="flex-1 min-w-0">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No products match your criteria
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                    Try adjusting your search terms, clearing selected category filters, or broadening the price range.
                  </p>
                  <button
                    onClick={() =>
                      setFilter({
                        searchQuery: '',
                        category: 'All',
                        subcategory: 'All',
                        priceRange: [0, MAX_CATALOG_PRICE],
                        minRating: 0,
                        inStockOnly: false,
                        sortBy: 'popularity',
                      })
                    }
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>

                  {/* Load More Pagination */}
                  {visibleCount < filteredProducts.length && (
                    <div className="mt-12 text-center">
                      <p className="text-xs text-slate-500 mb-3 font-mono">
                        Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
                      </p>
                      <button
                        onClick={() =>
                          setVisibleCount((prev) =>
                            Math.min(filteredProducts.length, prev + ITEMS_PER_PAGE)
                          )
                        }
                        className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold shadow-xs hover:border-slate-300 transition-all active:scale-98"
                      >
                        Load More Products ({filteredProducts.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Wishlist Drawer */}
      <WishlistDrawer onSelectProduct={(p) => setSelectedProduct(p)} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onSelectRelated={(p) => setSelectedProduct(p)}
        relatedProducts={relatedProducts}
      />

      {/* Checkout & Moniepoint Bank Transfer Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={(order) => {
          setIsCheckoutOpen(false);
          setCompletedOrder(order);
        }}
      />

      {/* Order Receipt Invoice Modal */}
      <InvoiceReceipt
        order={completedOrder}
        isOpen={Boolean(completedOrder)}
        onClose={() => setCompletedOrder(null)}
        onOpenMerchantDesk={() => setIsMerchantDeskOpen(true)}
      />

      {/* Merchant Order Receiving Desk */}
      <MerchantOrderDesk
        isOpen={isMerchantDeskOpen}
        onClose={() => setIsMerchantDeskOpen(false)}
      />

      {/* WhatsApp Floating Contact Action */}
      <WhatsAppFloat />

      {/* Footer */}
      <Footer
        onCategorySelect={handleCategorySelect}
        onOpenMerchantDesk={() => setIsMerchantDeskOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <StoreContent />
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </ToastProvider>
  );
}
