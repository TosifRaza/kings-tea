import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState([0, 200]);
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
    setPriceRange([0, 200]);
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
    priceRange[1] < 200;

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
      className="pt-24 pb-16 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut">
            Our Collection
          </h1>
          <div className="section-divider mt-4" />
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/40" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search teas by name, origin, category..."
              className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 text-xs border border-imperial-gold/20 px-3 bg-white focus:outline-none focus:border-imperial-gold"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
            </select>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden h-10 border border-imperial-gold/20 text-xs px-3 flex items-center gap-1 hover:bg-warm-ivory-dark transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && (
                <span className="bg-imperial-gold text-deep-walnut text-[10px] h-4 w-4 flex items-center justify-center rounded-full">
                  !
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

        <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)] mb-6">
          Showing {paginatedProducts.length} of {filteredProducts.length} teas
        </p>

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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product._id || product.id} product={product} />
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