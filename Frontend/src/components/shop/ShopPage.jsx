import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Leaf, LayoutGrid } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../store/productSlice';
import { fetchCategories } from '../../store/categorySlice';
import { ProductCard } from '../home/BestSellers';

function FilterSidebar({
  categories,
  selectedCategories,
  setSelectedCategories,
  selectedOrigins,
  setSelectedOrigins,
  selectedFermentations,
  setSelectedFermentations,
  priceRange,
  setPriceRange,
  toggleFilter,
  clearFilters,
  hasFilters,
  allProducts,
}) {
  const origins = [...new Set(allProducts.map((p) => p.origin).filter(Boolean))];
  const fermentations = [...new Set(allProducts.map((p) => p.fermentation).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-3">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat._id || cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name || cat)}
                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.name || cat)}
                className="accent-tea-green"
              />
              <span className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] group-hover:text-deep-walnut transition-colors">
                {cat.name || cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="h-8 text-xs border border-imperial-gold/20 px-2 w-full focus:outline-none focus:border-imperial-gold"
            placeholder="Min"
          />
          <span className="text-deep-walnut/40 text-xs">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="h-8 text-xs border border-imperial-gold/20 px-2 w-full focus:outline-none focus:border-imperial-gold"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-3">
          Origin
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {origins.map((origin) => (
            <label key={origin} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedOrigins.includes(origin)}
                onChange={() => toggleFilter(selectedOrigins, setSelectedOrigins, origin)}
                className="accent-tea-green"
              />
              <span className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] group-hover:text-deep-walnut transition-colors">
                {origin}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-3">
          Fermentation
        </h3>
        <div className="space-y-2">
          {fermentations.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFermentations.includes(f)}
                onChange={() => toggleFilter(selectedFermentations, setSelectedFermentations, f)}
                className="accent-tea-green"
              />
              <span className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] group-hover:text-deep-walnut transition-colors">
                {f}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full border border-royal-terracotta/30 text-royal-terracotta hover:bg-royal-terracotta/5 text-xs uppercase tracking-wider rounded-none py-2 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [query, setQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedFermentations, setSelectedFermentations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const perPage = 9;

  // Fetch products and categories from API
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleFilter = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedOrigins([]);
    setSelectedFermentations([]);
    setPriceRange([0, 20000]);
    setQuery('');
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.origin?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesOrigin =
        selectedOrigins.length === 0 || selectedOrigins.includes(p.origin);
      const matchesFermentation =
        selectedFermentations.length === 0 || selectedFermentations.includes(p.fermentation);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesQuery && matchesCategory && matchesOrigin && matchesFermentation && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return result;
  }, [products, query, selectedCategories, selectedOrigins, selectedFermentations, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedOrigins.length > 0 ||
    selectedFermentations.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 20000;
  const activeFilterCount = selectedCategories.length + selectedOrigins.length + selectedFermentations.length + (priceRange[0] > 0 || priceRange[1] < 20000 ? 1 : 0);

  const filterProps = {
    categories,
    allProducts: products,
    selectedCategories,
    setSelectedCategories,
    selectedOrigins,
    setSelectedOrigins,
    selectedFermentations,
    setSelectedFermentations,
    priceRange,
    setPriceRange,
    toggleFilter,
    clearFilters,
    hasFilters,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#fbfaf5] pb-12 pt-[68px] sm:pt-20"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <section className="relative -mx-2 mb-4 flex min-h-[122px] flex-col items-center justify-center overflow-hidden border-b border-[#e8e2d3] bg-[linear-gradient(180deg,#faf8ef_0%,#f3f0e4_72%,#eeecdf_100%)] px-4 py-4 text-center sm:mx-0 sm:mb-7 sm:min-h-[190px] sm:rounded-2xl">
          <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] w-full opacity-60" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 112 120 78 220 101 330 54 440 101 555 68 670 103 790 48 900 96 1010 55 1120 93 1200 68V180H0Z" fill="#fffdf5" />
            <path d="M0 139 140 105 270 127 390 91 520 131 650 100 770 134 900 91 1040 128 1140 96 1200 118V180H0Z" fill="#e7e7d9" opacity=".65" />
          </svg>
          <svg className="pointer-events-none absolute -left-3 top-1 h-[92%] w-[86px] text-[#61784d]/65 sm:w-28" viewBox="0 0 100 220" fill="none" aria-hidden="true">
            <path d="M4 210C44 166 22 105 83 18M16 175C8 146-1 137 2 117c18 2 28 15 29 34M30 139c-3-24 2-39 20-52 12 20 7 38-11 55M49 100c4-27 18-42 38-49 8 25-3 44-34 56M18 169c22-15 41-15 57-5-12 23-31 28-55 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 117c18 2 28 15 29 34-18-2-28-14-29-34ZM50 87c12 20 7 38-11 55-7-21-3-39 11-55ZM87 51c8 25-3 44-34 56 4-27 18-42 34-56ZM75 164c-12 23-31 28-55 17 22-15 41-15 55-17Z" fill="currentColor" fillOpacity=".22" />
          </svg>
          <svg className="pointer-events-none absolute -right-3 top-1 h-[92%] w-[86px] -scale-x-100 text-[#61784d]/65 sm:w-28" viewBox="0 0 100 220" fill="none" aria-hidden="true">
            <path d="M4 210C44 166 22 105 83 18M16 175C8 146-1 137 2 117c18 2 28 15 29 34M30 139c-3-24 2-39 20-52 12 20 7 38-11 55M49 100c4-27 18-42 38-49 8 25-3 44-34 56M18 169c22-15 41-15 57-5-12 23-31 28-55 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 117c18 2 28 15 29 34-18-2-28-14-29-34ZM50 87c12 20 7 38-11 55-7-21-3-39 11-55ZM87 51c8 25-3 44-34 56 4-27 18-42 34-56ZM75 164c-12 23-31 28-55 17 22-15 41-15 55-17Z" fill="currentColor" fillOpacity=".22" />
          </svg>
          <div className="relative z-10 mb-1 flex items-center gap-2 text-[#c99c3a]">
            <span className="h-px w-8 bg-[#d6a12e]" />
            <Leaf className="h-5 w-5 rotate-[-28deg] fill-current/30" />
            <span className="h-px w-8 bg-[#d6a12e]" />
          </div>
          <h1 className="relative z-10 font-[family-name:var(--font-playfair)] text-[30px] font-bold leading-none tracking-tight text-[#0d3025] sm:text-5xl">
            Our Collection
          </h1>
          <p className="relative z-10 mt-2 font-[family-name:var(--font-playfair)] text-base text-[#60776c] sm:mt-3 sm:text-xl">Find your perfect cup</p>
        </section>

        {/* Search & Sort Bar */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#143b2d]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search teas, origins..."
              className="h-12 w-full rounded-full border border-[#dddcd3] bg-white/80 pl-12 pr-4 text-sm text-[#263b32] shadow-[0_2px_8px_rgba(32,45,35,0.05)] outline-none transition focus:border-[#8d9d87] sm:h-14 sm:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="flex h-11 min-w-0 items-center rounded-xl border border-[#dcdace] bg-white/65 px-3 text-xs font-medium text-[#26332d] sm:h-12 sm:px-5 sm:text-sm">
              <span className="shrink-0">Sort:&nbsp;</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="min-w-0 flex-1 appearance-none bg-transparent text-xs outline-none sm:text-sm"
              >
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
              </select>
              <span className="ml-1 text-base leading-none text-[#12382a]">⌄</span>
            </label>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b4b35] to-[#073c2b] px-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:h-12 sm:px-6 lg:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#38ad69] px-1 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((c) => (
              <span
                key={c}
                className="bg-tea-green/10 text-tea-green text-xs gap-1 px-2 py-1 flex items-center"
              >
                {c}
                <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedOrigins.map((o) => (
              <span
                key={o}
                className="bg-royal-terracotta/10 text-royal-terracotta text-xs gap-1 px-2 py-1 flex items-center"
              >
                {o}
                <button onClick={() => toggleFilter(selectedOrigins, setSelectedOrigins, o)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedFermentations.map((f) => (
              <span
                key={f}
                className="bg-imperial-gold/10 text-imperial-gold-dark text-xs gap-1 px-2 py-1 flex items-center"
              >
                {f}
                <button onClick={() => toggleFilter(selectedFermentations, setSelectedFermentations, f)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center gap-3 text-sm text-[#315d50] sm:mb-6">
          <p className="shrink-0 font-medium sm:hidden">{filteredProducts.length} teas</p>
          <p className="hidden shrink-0 font-[family-name:var(--font-inter)] text-xs text-deep-walnut/50 sm:block">Showing {paginatedProducts.length} of {filteredProducts.length} teas</p>
          <span className="h-px flex-1 bg-[#dcdace]" />
          <LayoutGrid className="h-5 w-5 shrink-0 text-[#174b35]" aria-hidden="true" />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-imperial-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-deep-walnut/40 text-sm">Loading teas...</p>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-56 flex-shrink-0">
              <FilterSidebar {...filterProps} />
            </div>

            {/* Mobile Filters */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-warm-ivory p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut text-lg">
                    Filters
                  </h2>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X className="h-5 w-5 text-deep-walnut/60" />
                  </button>
                </div>
                <FilterSidebar {...filterProps} />
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full bg-tea-green text-warm-ivory py-3 text-xs uppercase tracking-wider mt-6"
                >
                  Apply Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-deep-walnut/50 font-[family-name:var(--font-inter)]">
                    No teas found matching your criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 border border-tea-green text-tea-green rounded-none px-6 py-2 text-xs uppercase tracking-wider hover:bg-tea-green hover:text-warm-ivory transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:gap-5 xl:grid-cols-3">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product._id || product.id} product={product} variant="collection" />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border border-imperial-gold/20 text-xs px-3 py-2 hover:bg-warm-ivory-dark disabled:opacity-40 transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`text-xs px-3 py-2 transition-colors ${
                            currentPage === i + 1
                              ? 'bg-tea-green text-warm-ivory'
                              : 'border border-imperial-gold/20 hover:bg-warm-ivory-dark'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border border-imperial-gold/20 text-xs px-3 py-2 hover:bg-warm-ivory-dark disabled:opacity-40 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
