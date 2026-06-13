import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Thermometer,
  Clock,
  Scale,
  Lightbulb,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductBySlug, fetchProducts } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlistLocal, selectIsWishlisted } from '../../store/wishlistSlice';

const mockReviews = [
  { id: 1, name: 'Eleanor V.', rating: 5, date: 'Oct 15, 2024', comment: 'Absolutely exquisite. The complexity of flavors unfolds with each sip. This is tea at its finest.' },
  { id: 2, name: 'Marcus T.', rating: 5, date: 'Sep 28, 2024', comment: 'Worth every penny. The brewing guide included was incredibly helpful for getting the perfect cup.' },
  { id: 3, name: 'Sophia L.', rating: 4, date: 'Sep 12, 2024', comment: 'Beautiful tea with remarkable depth. I prefer a slightly stronger brew but the quality is undeniable.' },
];

const gradientMap = {
  'from-amber-800 to-amber-600': 'bg-gradient-to-br from-amber-800 to-amber-600',
  'from-amber-900 to-amber-700': 'bg-gradient-to-br from-amber-900 to-amber-700',
  'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
  'from-green-600 to-green-400': 'bg-gradient-to-br from-green-600 to-green-400',
  'from-green-700 to-green-500': 'bg-gradient-to-br from-green-700 to-green-500',
  'from-amber-700 to-yellow-600': 'bg-gradient-to-br from-amber-700 to-yellow-600',
  'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
  'from-emerald-800 to-emerald-600': 'bg-gradient-to-br from-emerald-800 to-emerald-600',
  'from-red-900 to-red-700': 'bg-gradient-to-br from-red-900 to-red-700',
  'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
  'from-orange-600 to-amber-400': 'bg-gradient-to-br from-orange-600 to-amber-400',
  'from-green-800 to-green-600': 'bg-gradient-to-br from-green-800 to-green-600',
  'from-green-500 to-green-300': 'bg-gradient-to-br from-green-500 to-green-300',
  'from-gray-300 to-gray-100': 'bg-gradient-to-br from-gray-300 to-gray-100',
  'from-pink-100 to-white': 'bg-gradient-to-br from-pink-100 to-white',
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // ===== ALL HOOKS AT THE TOP — BEFORE ANY CONDITIONAL RETURNS =====
  const { currentProduct: product, products: allProducts, loading, error } = useSelector((state) => state.products);

  // Get productId for wishlist (safe even if product is null)
  const productId = product?._id || product?.id || '';
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, slug]);

  useEffect(() => {
    setQuantity(1);
    setActiveTab('description');
  }, [slug]);

  // ===== NOW DO CONDITIONAL RENDERS =====

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3A281C]/50">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3A281C]/50 mb-4">Failed to load product.</p>
          <button
            onClick={() => dispatch(fetchProductBySlug(slug))}
            className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3A281C]/50 mb-4">Product not found.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const related = (allProducts || []).filter(
    (p) => (p._id || p.id) !== productId && p.category === product.category
  ).slice(0, 3);

  const gradient = product.gradientColor
    ? (gradientMap[product.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
    : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

  const brewing = product.brewingGuide || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-16 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-[#3A281C]/60 hover:text-[#3A281C] transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className={`aspect-square rounded-sm overflow-hidden ${gradient} mb-4`}>
              <div className="w-full h-full flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white/20 text-6xl font-bold">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm overflow-hidden ${gradient} opacity-80 hover:opacity-100 cursor-pointer transition-opacity border-2 ${
                    i === 1 ? 'border-[#C9A86A]' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {product.images && product.images[i - 1] ? (
                      <img
                        src={`http://localhost:5000${product.images[i - 1]}`}
                        alt={`${product.name} ${i}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white/20 text-lg font-bold">{i}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex gap-2 mb-3">
              {product.isNew && (
                <span className="bg-[#C9A86A] text-[#3A281C] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  New
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-[#A65A3A] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#3A281C] mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#3A281C]/50 text-xs">
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-bold text-[#3A281C]">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-[#3A281C]/40 text-base line-through">
                  ₹{product.comparePrice?.toLocaleString()}
                </span>
              )}
              <span className="text-[#3A281C]/40 text-xs">
                / {product.weight}
              </span>
            </div>

            <p className="text-[#3A281C]/70 text-sm leading-relaxed mb-6">
              {product.shortDescription || product.description?.substring(0, 120)}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-[#3A281C] text-sm mb-2">
                Tasting Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {(product.tastingNotes || []).map((note) => (
                  <span
                    key={note}
                    className="bg-[#1F4D3A]/10 text-[#1F4D3A] text-xs px-2 py-0.5 rounded-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#F8F3E9] rounded-sm p-4 mb-6">
              <h3 className="font-semibold text-[#3A281C] text-sm mb-3">
                Brewing Guide
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <Thermometer className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
                  <p className="text-[10px] text-[#3A281C]/50">Temperature</p>
                  <p className="text-xs text-[#3A281C] font-medium">
                    {brewing.temperature || 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
                  <p className="text-[10px] text-[#3A281C]/50">Steep Time</p>
                  <p className="text-xs text-[#3A281C] font-medium">
                    {brewing.steepTime || 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <Scale className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
                  <p className="text-[10px] text-[#3A281C]/50">Amount</p>
                  <p className="text-xs text-[#3A281C] font-medium">
                    {brewing.amount || 'N/A'}
                  </p>
                </div>
              </div>
              {brewing.instructions && (
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-[#C9A86A] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#3A281C]/60 leading-relaxed">
                    {brewing.instructions}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-[#C9A86A]/20 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => dispatch(addToCart({ productId, quantity }))}
                className="flex-1 bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] h-10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart — ₹{(product.price * quantity)?.toLocaleString()}
              </button>

              <button
                onClick={() => dispatch(toggleWishlistLocal(productId))}
                className="h-10 w-10 border border-[#C9A86A]/20 p-0 flex items-center justify-center hover:bg-[#F8F3E9] transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? 'fill-[#A65A3A] text-[#A65A3A]' : 'text-[#3A281C]/40'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#3A281C]/60">
              <div><span className="text-[#3A281C]/40">Origin:</span> {product.origin}</div>
              <div><span className="text-[#3A281C]/40">Category:</span> {product.category}</div>
              <div><span className="text-[#3A281C]/40">Fermentation:</span> {product.fermentation}</div>
              <div><span className="text-[#3A281C]/40">Caffeine:</span> {product.caffeine}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-[#C9A86A]/10 gap-6">
            {['description', 'reviews', 'related'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#C9A86A] text-[#3A281C] font-medium'
                    : 'text-[#3A281C]/40 hover:text-[#3A281C]'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="mt-8 max-w-3xl">
              <p className="text-[#3A281C]/70 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="mt-8 space-y-6 max-w-3xl">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-[#C9A86A]/10 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center">
                        <span className="text-[#1F4D3A] text-xs font-semibold">{review.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-[#3A281C] text-sm">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-[#3A281C]/40 text-xs">
                      {review.date}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#3A281C]/70 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'related' && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {related.map((p) => {
                const relGradient = p.gradientColor
                  ? (gradientMap[p.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
                  : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';
                return (
                  <div
                    key={p._id || p.id}
                    onClick={() => {
                      navigate(`/product/${p.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cursor-pointer group bg-white rounded-sm overflow-hidden border border-[#C9A86A]/10 hover:shadow-lg transition-shadow"
                  >
                    <div className={`aspect-[4/5] ${relGradient} group-hover:scale-105 transition-transform duration-700 flex items-center justify-center`}>
                      {p.images && p.images.length > 0 ? (
                        <img src={`http://localhost:5000${p.images[0]}`} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white/20 text-3xl font-bold">{p.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#3A281C] text-sm mb-1 group-hover:text-[#1F4D3A] transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-semibold text-[#3A281C] text-sm">₹{p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
              {related.length === 0 && (
                <p className="text-[#3A281C]/40 text-sm col-span-3 text-center py-8">
                  No related products found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}