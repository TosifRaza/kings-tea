import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Leaf, Package, IndianRupee, MapPin, ChevronDown, ShieldCheck, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../store/productSlice';
import { fetchCategories } from '../../store/categorySlice';
import { ProductCard } from '../home/BestSellers';
import { IMAGE_URL } from '../../utils/image';

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
  const countFor = (field, value) => allProducts.filter((product) => product[field] === value).length;
  const sectionHeading = (Icon, label) => (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#173a2d]">
      <Icon className="h-4 w-4 text-[#0a5941]" />{label}
    </h3>
  );
  const filterLabel = (label, checked, onChange, count) => (
    <label className="group flex cursor-pointer items-center gap-2.5 text-[12px] text-[#52605a] transition hover:text-[#123d2d]">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded accent-[#075b40]" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="min-w-6 rounded-full bg-[#edf0e7] px-1.5 py-0.5 text-center text-[10px] text-[#4e6659]">{count}</span>
    </label>
  );

  return (
    <div className="space-y-5 rounded-xl border border-[#e9e7dc] bg-[#fffefa] p-4 shadow-[0_5px_18px_rgba(31,48,38,0.06)] sm:p-5">
      <h2 className="flex items-center gap-2 border-b border-[#eeece4] pb-4 font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#123d2d]"><SlidersHorizontal className="h-4 w-4" />Filter Products</h2>
      <div className="border-b border-[#eeece4] pb-4">
        {sectionHeading(Leaf, 'Category')}
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat._id || cat}>
              {filterLabel(cat.name || cat, selectedCategories.includes(cat.name || cat), () => toggleFilter(selectedCategories, setSelectedCategories, cat.name || cat), countFor('category', cat.name || cat))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#eeece4] pb-4">
        {sectionHeading(IndianRupee, 'Price Range')}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="h-9 w-full rounded-md border border-[#e8e6dc] bg-[#fffefa] px-2 text-xs focus:border-[#0c6146] focus:outline-none"
            placeholder="Min"
          />
          <span className="text-deep-walnut/40 text-xs">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="h-9 w-full rounded-md border border-[#e8e6dc] bg-[#fffefa] px-2 text-xs focus:border-[#0c6146] focus:outline-none"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="border-b border-[#eeece4] pb-4">
        {sectionHeading(MapPin, 'Origin')}
        <div className="max-h-48 space-y-2.5 overflow-y-auto">
          {origins.map((origin) => (
            <div key={origin}>
              {filterLabel(origin, selectedOrigins.includes(origin), () => toggleFilter(selectedOrigins, setSelectedOrigins, origin), countFor('origin', origin))}
            </div>
          ))}
        </div>
      </div>

      <div>
        {sectionHeading(Package, 'Fermentation')}
        <div className="space-y-2.5">
          {fermentations.map((f) => (
            <div key={f}>
              {filterLabel(f === 'none' ? 'None (Non-fermented)' : f, selectedFermentations.includes(f), () => toggleFilter(selectedFermentations, setSelectedFermentations, f), countFor('fermentation', f))}
            </div>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-[#0c6146] bg-[#075b40] py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#064833]"
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
  const bannerImage = products.find((product) => product.images?.[0] && !product.images[0].includes('/kingstea-packets/'))?.images?.[0] || '';
  const bannerImageUrl = bannerImage.startsWith('/uploads/') ? `${IMAGE_URL}${bannerImage}` : bannerImage;

  const [query, setQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedFermentations, setSelectedFermentations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const perPage = 12;

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
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
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
      className="min-h-screen bg-[#f7f6ef] pb-12 pt-[60px] sm:pt-20"
    >
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8">
        <div className="grid items-start gap-4 lg:grid-cols-[230px_minmax(0,1fr)] xl:gap-5">
        <aside className="sticky top-24 z-20 hidden self-start lg:block">
          <FilterSidebar {...filterProps} />
          <div className="relative mt-4 min-h-[120px] overflow-hidden rounded-xl bg-[#06412e] p-4 text-white shadow-sm">
            <Leaf className="h-6 w-6" />
            <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg font-semibold">Premium Quality</p>
            <p className="text-[11px] text-white/80">Authentic teas. Pure experience.</p>
            <div className="pointer-events-none absolute -bottom-8 -right-4 h-24 w-24 rotate-[-25deg] text-[#b2bd63]/30"><Leaf className="h-full w-full" /></div>
          </div>
        </aside>
        <main className="min-w-0">
        <section className="relative mb-3 flex min-h-[205px] items-center overflow-hidden rounded-xl bg-[#052d21] px-6 py-6 text-white shadow-sm sm:min-h-[236px] sm:px-10">
          <img src={bannerImageUrl || '/images/hero-tea-plantation.png'} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03271e]/95 via-[#063a2b]/80 to-[#062a20]/30" />
          <div className="relative z-10 max-w-[58%] sm:max-w-[53%]">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#ecd077] sm:text-xs"><Leaf className="h-4 w-4 fill-[#d3b84d]" />Premium Tea Collection <span className="hidden h-px w-10 bg-[#d3b84d] sm:block" /></p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-[1.03] sm:text-5xl">Nature’s Finest in<br />Every Cup</h1>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-white/90 sm:text-sm">Discover authentic flavors, fresh aromas and a healthier you with our handpicked premium teas.</p>
            <div className="mt-4 hidden flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/90 sm:flex"><span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-[#e6cb73]" />100% Natural</span><span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#e6cb73]" />No Added Preservatives</span><span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-[#e6cb73]" />Rich in Antioxidants</span></div>
          </div>
          <p className="absolute bottom-5 right-5 z-10 hidden rotate-[-8deg] font-[family-name:var(--font-playfair)] text-xl italic leading-tight text-[#efd583] sm:block">Pure goodness<br />in every sip</p>
        </section>

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

        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 rounded-xl border border-[#e7e2d5] bg-[#fffefa] px-3 py-2.5 text-sm text-[#315d50] shadow-[0_5px_18px_rgba(31,48,38,0.06)] sm:flex sm:gap-3 sm:px-4 sm:py-3">
          <div className="col-span-2 min-w-0 sm:flex-1"><h2 className="truncate font-[family-name:var(--font-playfair)] text-base font-semibold leading-tight text-[#123d2d] sm:text-xl">Premium Tea Collection</h2><p className="hidden text-xs text-[#6b7770] sm:block">Handpicked teas for a healthier, happier you.</p></div>
          <div className="relative hidden min-w-[150px] max-w-[220px] flex-1 md:block"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#315d50]" /><input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Search teas..." className="h-9 w-full rounded-lg border border-[#e9e7df] bg-[#fbfaf5] pl-8 pr-2 text-xs outline-none focus:border-[#789482]" /></div>
          <p className="hidden shrink-0 text-xs text-[#64736b] 2xl:block">Showing {paginatedProducts.length} of {filteredProducts.length} teas</p>
          <label className="flex h-8 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#e9e7df] bg-[#fbfaf5] px-2 text-[10px] text-[#58675e] sm:h-9 sm:px-3 sm:text-xs"><span className="hidden sm:inline">Sort by:</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products" className="max-w-[108px] appearance-none bg-transparent font-medium text-[#234b3a] outline-none sm:max-w-[130px]"><option value="rating">Popularity</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest First</option><option value="name">Name A-Z</option></select><ChevronDown className="h-3.5 w-3.5 shrink-0" /></label>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-[#0b6649] to-[#07553e] px-3 text-[11px] font-semibold text-white shadow-sm lg:hidden sm:h-9 sm:px-3 sm:text-xs"><SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Filters{activeFilterCount > 0 && <span>({activeFilterCount})</span>}</button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-imperial-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-deep-walnut/40 text-sm">Loading teas...</p>
          </div>
        ) : (
          <div className="flex gap-8">
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
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
        </main>
        </div>
      </div>
    </motion.div>
  );
}
