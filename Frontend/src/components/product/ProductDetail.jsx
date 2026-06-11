import { useState } from 'react';
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
import { addToCart } from '../../store/cartSlice';
import { toggleWishlistLocal, selectIsWishlisted } from '../../store/wishlistSlice';
import { products } from '../../assets/data';

const mockReviews = [
  { id: 1, name: 'Eleanor V.', rating: 5, date: 'Oct 15, 2024', comment: 'Absolutely exquisite. The complexity of flavors unfolds with each sip. This is tea at its finest.' },
  { id: 2, name: 'Marcus T.', rating: 5, date: 'Sep 28, 2024', comment: 'Worth every penny. The brewing guide included was incredibly helpful for getting the perfect cup.' },
  { id: 3, name: 'Sophia L.', rating: 4, date: 'Sep 12, 2024', comment: 'Beautiful tea with remarkable depth. I prefer a slightly stronger brew but the quality is undeniable.' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <p className="text-deep-walnut/50 font-[family-name:var(--font-inter)]">
          Product not found.
        </p>
      </div>
    );
  }

  const isWishlisted = useSelector((state) => selectIsWishlisted(state, product.id));
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

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
          className="flex items-center gap-2 text-deep-walnut/60 hover:text-deep-walnut transition-colors mb-8 font-[family-name:var(--font-inter)] text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className={`aspect-square rounded-sm overflow-hidden bg-gradient-to-br ${product.gradient} mb-4`}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-[family-name:var(--font-playfair)] text-white/20 text-6xl font-bold">
                  {product.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm overflow-hidden bg-gradient-to-br ${product.gradient} opacity-80 hover:opacity-100 cursor-pointer transition-opacity border-2 ${
                    i === 1 ? 'border-imperial-gold' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-lg font-bold">{i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex gap-2 mb-3">
              {product.isNew && (
                <span className="bg-imperial-gold text-deep-walnut text-[10px] font-semibold uppercase tracking-wider border-0 rounded-sm px-2 py-0.5">
                  New
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-royal-terracotta text-white text-[10px] font-semibold uppercase tracking-wider border-0 rounded-sm px-2 py-0.5">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-deep-walnut mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'text-imperial-gold fill-imperial-gold' : 'text-deep-walnut/15'
                    }`}
                  />
                ))}
              </div>
              <span className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)]">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-deep-walnut">
                ${product.price}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-deep-walnut/40 text-base line-through">
                  ${product.comparePrice}
                </span>
              )}
              <span className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">
                / {product.weight}
              </span>
            </div>

            <p className="text-deep-walnut/70 text-sm font-[family-name:var(--font-inter)] leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            <div className="mb-6">
              <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-2">
                Tasting Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="bg-tea-green/10 text-tea-green text-xs rounded-sm border-0 px-2 py-0.5"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-warm-ivory-dark rounded-sm p-4 mb-6">
              <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-3">
                Brewing Guide
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <Thermometer className="h-4 w-4 text-royal-terracotta mx-auto mb-1" />
                  <p className="text-[10px] text-deep-walnut/50 font-[family-name:var(--font-inter)]">Temperature</p>
                  <p className="text-xs text-deep-walnut font-medium font-[family-name:var(--font-inter)]">
                    {product.brewingGuide.temperature.split('/')[0]}
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="h-4 w-4 text-royal-terracotta mx-auto mb-1" />
                  <p className="text-[10px] text-deep-walnut/50 font-[family-name:var(--font-inter)]">Steep Time</p>
                  <p className="text-xs text-deep-walnut font-medium font-[family-name:var(--font-inter)]">
                    {product.brewingGuide.steepTime}
                  </p>
                </div>
                <div className="text-center">
                  <Scale className="h-4 w-4 text-royal-terracotta mx-auto mb-1" />
                  <p className="text-[10px] text-deep-walnut/50 font-[family-name:var(--font-inter)]">Ratio</p>
                  <p className="text-xs text-deep-walnut font-medium font-[family-name:var(--font-inter)]">
                    {product.brewingGuide.ratio}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-deep-walnut/60 font-[family-name:var(--font-inter)] leading-relaxed">
                  {product.brewingGuide.tips}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-imperial-gold/20 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-deep-walnut/60 hover:text-deep-walnut transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium font-[family-name:var(--font-inter)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-deep-walnut/60 hover:text-deep-walnut transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => dispatch(addToCart({ productId: product.id, quantity }))}
                className="btn-luxury flex-1 bg-tea-green hover:bg-tea-green-light text-warm-ivory h-10 text-xs font-semibold uppercase tracking-wider rounded-none flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart — ${product.price * quantity}
              </button>

              <button
                onClick={() => dispatch(toggleWishlistLocal(product.id))}
                className="h-10 w-10 rounded-none border border-imperial-gold/20 p-0 flex items-center justify-center hover:bg-warm-ivory-dark transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-deep-walnut/40'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-[family-name:var(--font-inter)] text-deep-walnut/60">
              <div><span className="text-deep-walnut/40">Origin:</span> {product.origin}</div>
              <div><span className="text-deep-walnut/40">Category:</span> {product.category}</div>
              <div><span className="text-deep-walnut/40">Fermentation:</span> {product.fermentation}</div>
              <div><span className="text-deep-walnut/40">Caffeine:</span> {product.caffeine}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-imperial-gold/10 gap-6">
            {['description', 'reviews', 'related'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-[family-name:var(--font-inter)] text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-imperial-gold text-deep-walnut font-medium'
                    : 'text-deep-walnut/40 hover:text-deep-walnut'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="mt-8 max-w-3xl">
              <p className="text-deep-walnut/70 font-[family-name:var(--font-inter)] text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="mt-8 space-y-6 max-w-3xl">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-imperial-gold/10 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-tea-green/10 flex items-center justify-center">
                        <span className="text-tea-green text-xs font-semibold">{review.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-deep-walnut text-sm font-[family-name:var(--font-inter)]">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">
                      {review.date}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating ? 'text-imperial-gold fill-imperial-gold' : 'text-deep-walnut/15'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-deep-walnut/70 text-sm font-[family-name:var(--font-inter)] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'related' && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer group luxury-card bg-white rounded-sm overflow-hidden border border-imperial-gold/10"
                >
                  <div className={`aspect-[4/5] bg-gradient-to-br ${p.gradient} group-hover:scale-105 transition-transform duration-700`} />
                  <div className="p-4">
                    <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-1 group-hover:text-tea-green transition-colors">
                      {p.name}
                    </h3>
                    <span className="font-semibold text-deep-walnut text-sm">${p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
