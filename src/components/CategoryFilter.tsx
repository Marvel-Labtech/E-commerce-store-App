import React from 'react';
import { FilterState, MainCategory, Subcategory } from '../types';
import { CATEGORIES_DATA } from '../data/categories';
import { Filter, X, RotateCcw, Check, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { formatNaira } from '../data/products';

interface CategoryFilterProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  maxCatalogPrice: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filter,
  setFilter,
  totalResults,
  isOpenMobile,
  onCloseMobile,
  maxCatalogPrice,
}) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(
    filter.category !== 'All' ? filter.category : null
  );

  const handleCategorySelect = (categoryName: MainCategory | 'All') => {
    setFilter((prev) => ({
      ...prev,
      category: categoryName,
      subcategory: 'All', // Reset subcategory when category changes
    }));
    if (categoryName !== 'All') {
      setExpandedCategory(categoryName);
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory | 'All') => {
    setFilter((prev) => ({
      ...prev,
      subcategory,
    }));
  };

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      category: 'All',
      subcategory: 'All',
      priceRange: [0, maxCatalogPrice],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'popularity',
    });
    setExpandedCategory(null);
  };

  const hasActiveFilters =
    filter.category !== 'All' ||
    filter.subcategory !== 'All' ||
    filter.priceRange[0] > 0 ||
    filter.priceRange[1] < maxCatalogPrice ||
    filter.minRating > 0 ||
    filter.inStockOnly ||
    filter.searchQuery.length > 0;

  const content = (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Header with active count & reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
          <span className="text-xs text-slate-500 font-mono">({totalResults} items)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Accordion */}
      <div>
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
          Categories
        </label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filter.category === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>All Categories</span>
            {filter.category === 'All' && <Check className="w-3.5 h-3.5" />}
          </button>

          {CATEGORIES_DATA.map((cat) => {
            const isSelected = filter.category === cat.name;
            const isExpanded = expandedCategory === cat.name;

            return (
              <div key={cat.id} className="flex flex-col">
                <button
                  onClick={() => {
                    handleCategorySelect(cat.name);
                    setExpandedCategory(isExpanded ? null : cat.name);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Subcategories drawer */}
                {isExpanded && (
                  <div className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l-2 border-indigo-200 ml-3 my-1">
                    <button
                      onClick={() => handleSubcategorySelect('All')}
                      className={`text-left text-xs py-1 px-2 rounded-lg transition-colors ${
                        filter.subcategory === 'All'
                          ? 'text-indigo-600 font-bold bg-indigo-50/50'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      All {cat.name}
                    </button>
                    {cat.subcategories.map((sub) => {
                      const isSubSelected = filter.subcategory === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => handleSubcategorySelect(sub)}
                          className={`text-left text-xs py-1 px-2 rounded-lg transition-colors truncate ${
                            isSubSelected
                              ? 'text-indigo-600 font-bold bg-indigo-50/50'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
          Price Range (₦)
        </label>
        <div className="flex items-center justify-between text-xs text-slate-600 font-mono mb-2">
          <span>{formatNaira(filter.priceRange[0])}</span>
          <span>{formatNaira(filter.priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxCatalogPrice}
          step={5000}
          value={filter.priceRange[1]}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              priceRange: [prev.priceRange[0], Number(e.target.value)],
            }))
          }
          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setFilter((p) => ({ ...p, priceRange: [0, 50000] }))}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-600 transition-colors"
          >
            Under ₦50k
          </button>
          <button
            onClick={() => setFilter((p) => ({ ...p, priceRange: [0, 200000] }))}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-600 transition-colors"
          >
            Under ₦200k
          </button>
          <button
            onClick={() => setFilter((p) => ({ ...p, priceRange: [0, maxCatalogPrice] }))}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-600 transition-colors"
          >
            Any
          </button>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
          Rating
        </label>
        <div className="flex flex-col gap-1.5">
          {[4.5, 4.0, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter((prev) => ({ ...prev, minRating: rating }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors ${
                filter.minRating === rating
                  ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>{rating === 0 ? 'Any Rating' : `${rating} Stars & above`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.inStockOnly}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                inStockOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span className="text-xs font-medium text-slate-800">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer container */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-base">Filter Catalog</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 sticky bottom-0 bg-white">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                Apply Filters ({totalResults} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
