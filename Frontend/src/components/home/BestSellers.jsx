import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, Star, Crown, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import { fetchProducts } from '../../store/productSlice';
import { IMAGE_URL } from "../../utils/image";

function ProductCard({ product, variant = 'default' }) {
  const dispatch = useDispatch();
  const productId = product._id || product.id;
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));
  const productSlug = product.slug || productId;
  const [imageFailed, setImageFailed] = useState(false);
  const image = product.images?.[0];
  const imageUrl = image?.startsWith('/uploads/') ? `${IMAGE_URL}${image}` : image;
  const price = Number(product.price || 0);
  const comparePrice = Number(product.comparePrice || 0);
  const hasDiscount = comparePrice > price;
  const discount = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const isOutOfStock = product.inStock === false;

  if (variant === 'collection' || variant === 'cherished') {
    const isCherished = variant === 'cherished';
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e6dc] bg-[#fffefa] shadow-[0_8px_24px_rgba(58,40,28,0.10)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(58,40,28,0.15)] ${isCherished ? 'sm:rounded-[22px]' : 'sm:rounded-[26px]'}`}
      >
        <div className="relative">
          <Link
            to={`/product/${productSlug}`}
            aria-label={`View ${product.name}`}
            className={`flex items-center justify-center overflow-hidden bg-[#eef0df] ${isCherished ? 'aspect-[1.62/1]' : 'aspect-[1.55/1] sm:aspect-[1.45/1]'}`}
          >
            {imageUrl && !imageFailed ? (
              <img
                src={imageUrl}
                alt={product.name}
                className={`h-full w-full object-cover transition-transform duration-500 ${isCherished ? 'scale-[1.18] hover:scale-[1.24]' : 'hover:scale-[1.03]'}`}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#dfe8d2] to-[#a8c19b]">
                <span className="font-[family-name:var(--font-playfair)] text-6xl font-semibold text-tea-green/70" aria-hidden="true">{product.name?.charAt(0)}</span>
              </div>
            )}
          </Link>

          <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5 sm:left-4 sm:top-4">
            {product.bestSeller && (
              <span className={`inline-flex items-center gap-1 font-semibold shadow-sm ${isCherished ? 'rounded-full border border-white/35 bg-[#07553e] px-2 py-1.5 text-[9px] text-white sm:gap-1.5 sm:px-3 sm:text-xs' : 'rounded-md bg-[#07553e] px-1.5 py-1 text-[8px] text-white sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs'}`}>
                <Crown className="h-3 w-3 text-[#f5d27b] sm:h-3.5 sm:w-3.5" /> Best Seller
              </span>
            )}
            {!product.bestSeller && product.isNew && (
              <span className={`inline-flex items-center gap-1 font-semibold shadow-sm ${isCherished ? 'rounded-full border border-[#fff7db] bg-[#f2d28b] px-2 py-1.5 text-[9px] text-[#3a281c] sm:px-3 sm:text-xs' : 'rounded-md bg-[#f2d28b] px-1.5 py-1 text-[8px] text-[#3a281c] sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs'}`}>
                {isCherished && <Sparkles className="h-3 w-3" />}{isCherished ? 'New Arrival' : 'New arrival'}
              </span>
            )}
            {isCherished && !product.bestSeller && !product.isNew && product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-[#d4a03e] px-2 py-1.5 text-[9px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"><Sparkles className="h-3 w-3" />Premium</span>
            )}
            {isCherished && !product.bestSeller && !product.isNew && !product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-[#07553e] px-2 py-1.5 text-[9px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"><Flame className="h-3 w-3" />Popular</span>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleWishlist(productId))}
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e9e8df] bg-white/95 shadow-sm transition hover:scale-105 hover:bg-white sm:right-3 sm:top-3 sm:h-10 sm:w-10"
          >
            <Heart className={`h-4 w-4 transition-colors sm:h-5 sm:w-5 ${isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-[#263b32]'}`} />
          </button>
        </div>

        <div className={`flex flex-1 flex-col pb-3 pt-3 ${isCherished ? 'px-3 sm:px-4 sm:pb-4' : 'px-2.5 sm:px-5 sm:pb-5 sm:pt-4'}`}>
          <div className={`mb-1 flex min-w-0 ${isCherished ? '' : 'items-center justify-between gap-1'}`}>
            <p className={`min-w-0 truncate font-semibold uppercase text-[#34483f] ${isCherished ? 'text-[10px] tracking-[0.08em] sm:text-xs sm:tracking-[0.12em]' : 'flex-1 text-[10px] tracking-[0.03em] sm:text-[13px] sm:tracking-[0.13em]'}`}>
              {product.origin || product.category || 'Premium tea'}
            </p>
            {!isCherished && (
              <Link to={`/product/${productSlug}`} className="inline-flex shrink-0 items-center gap-0.5 text-[8px] sm:gap-1 sm:text-xs" aria-label={`${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.reviewCount || 0} reviews`}>
                <span className="flex items-center" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-2 w-2 sm:h-3.5 sm:w-3.5 ${i < Math.round(product.rating || 0) ? 'fill-[#efa900] text-[#efa900]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />)}
                </span>
                <span className="font-medium text-[#263b32]">{Number(product.rating || 0).toFixed(1)}</span>
                <span className="hidden text-[#61756d] sm:inline">({(product.reviewCount || 0).toLocaleString('en-IN')})</span>
              </Link>
            )}
          </div>
          <Link to={`/product/${productSlug}`} className={`line-clamp-2 min-h-[1.5em] font-[family-name:var(--font-playfair)] font-semibold leading-tight text-[#202923] hover:text-tea-green ${isCherished ? 'text-lg sm:text-[22px]' : 'text-xl sm:text-[26px]'}`}>
            {product.name}
          </Link>
          <p className={`line-clamp-2 ${isCherished ? 'mt-1 min-h-9 text-xs leading-[18px] sm:mt-1.5 sm:min-h-10 sm:text-sm sm:leading-5' : 'mt-1 min-h-9 text-[13px] leading-[18px] text-[#61756d] sm:mt-2 sm:min-h-10 sm:text-base sm:leading-[22px]'}`}>
            {product.shortDescription || product.description || 'A carefully selected tea for a memorable cup.'}
          </p>

          {isCherished && <Link to={`/product/${productSlug}`} className="mt-1 inline-flex min-w-0 items-center gap-1 text-[8px] sm:mt-1.5 sm:gap-1.5 sm:text-[11px]" aria-label={`${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.reviewCount || 0} reviews`}>
            <span className="flex items-center" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.round(product.rating || 0) ? 'fill-[#f2aa19] text-[#f2aa19]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />
              ))}
            </span>
            <span className="font-medium text-[#34483f]">{Number(product.rating || 0).toFixed(1)}</span>
            <span className="truncate text-[#78827d]">({(product.reviewCount || 0).toLocaleString('en-IN')} reviews)</span>
          </Link>}

          <div className={`mt-1 min-w-0 items-center sm:mt-2 ${isCherished ? 'flex flex-nowrap justify-between gap-x-1' : 'flex flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2'}`}>
            <span className={`font-bold tracking-tight text-[#07553e] ${isCherished ? 'shrink-0 text-base leading-none sm:text-2xl' : 'text-lg sm:text-2xl'}`}>{'\u20B9'}{price.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className={`shrink-0 text-[#8a918d] line-through ${isCherished ? 'text-[8px] sm:text-xs' : 'text-[9px] sm:text-xs'}`}>{'\u20B9'}{comparePrice.toLocaleString('en-IN')}</span>}
            {hasDiscount && <span className={`shrink-0 rounded-full bg-[#fde9e6] font-semibold text-[#b3261e] ${isCherished ? 'px-1.5 py-1 text-[7px] sm:px-2.5 sm:text-[10px]' : 'ml-auto px-2 py-1 text-[8px] sm:px-3 sm:text-[10px]'}`}>Save {discount}%</span>}
          </div>

          <div className={`mt-auto flex items-center gap-2 ${isCherished ? 'pt-2 sm:pt-3' : 'pt-2 sm:pt-4'}`}>
            {isOutOfStock && <p className="mt-1 text-[11px] font-medium text-[#b42318]">Currently unavailable</p>}
            <Link to={`/product/${productSlug}`} aria-label={`View ${product.name}`} className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e9e8df] text-[#174b35] transition hover:border-[#174b35] hover:bg-[#edf3e8] sm:h-10 sm:w-10">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e7e5e4] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="relative">
        <Link
          to={`/product/${productSlug}`}
          aria-label={`View ${product.name}`}
          className="flex aspect-square items-center justify-center overflow-hidden bg-[#faf9f6] p-3 sm:p-4"
        >
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${product.gradient || 'from-tea-green to-tea-green-light'}`}>
              <span className="font-[family-name:var(--font-playfair)] text-5xl font-semibold text-white/80" aria-hidden="true">
                {product.name?.charAt(0)}
              </span>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestSeller && <span className="rounded-sm bg-[#a65a3a] px-2 py-1 text-[10px] font-semibold text-white">Best seller</span>}
          {!product.bestSeller && product.isNew && <span className="rounded-sm bg-[#f2d28b] px-2 py-1 text-[10px] font-semibold text-[#3a281c]">New arrival</span>}
          {hasDiscount && <span className="rounded-sm bg-[#fef3c7] px-2 py-1 text-[10px] font-semibold text-[#92400e]">Save {discount}%</span>}
        </div>

        <button
          onClick={() => dispatch(toggleWishlist(productId))}
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-colors hover:bg-[#f8f7f5]"
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-deep-walnut/55'}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-deep-walnut/50">
          {product.origin || 'Single-origin tea'}{product.weight ? ` · ${product.weight}` : ''}
        </p>
        <Link
          to={`/product/${productSlug}`}
          className="line-clamp-2 min-h-10 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#1f2937] hover:text-tea-green"
        >
          {product.name}
        </Link>

        <Link to={`/product/${productSlug}`} className="mt-2 inline-flex min-h-5 items-center gap-1.5 text-xs" aria-label={`${product.rating || 0} out of 5 stars, ${product.reviewCount || 0} reviews`}>
          <span className="font-semibold text-[#3a281c]">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="flex items-center" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating || 0) ? 'fill-[#d49b24] text-[#d49b24]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />
            ))}
          </span>
          <span className="text-[#2563eb]">{(product.reviewCount || 0).toLocaleString('en-IN')}</span>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xl font-semibold tracking-tight text-[#1f2937]">₹{price.toLocaleString('en-IN')}</span>
          {hasDiscount && <span className="text-xs text-deep-walnut/50 line-through">₹{comparePrice.toLocaleString('en-IN')}</span>}
        </div>
        <p className="mt-0.5 text-[11px] text-deep-walnut/55">Inclusive of all taxes</p>
        {product.inStock !== undefined && (
          <p className={`mt-1 text-xs font-medium ${isOutOfStock ? 'text-[#b42318]' : 'text-[#16794b]'}`}>
            {isOutOfStock ? 'Currently unavailable' : 'In stock'}
          </p>
        )}

        <Link to={`/product/${productSlug}`} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#f5c542] px-3 text-xs font-semibold text-[#27231b] transition-colors hover:bg-[#eab72f]">
          View product
        </Link>
      </div>
    </motion.article>
  );
}

export { ProductCard };

export default function BestSellers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section ref={ref} className="pt-4 pb-12 lg:pt-6 lg:pb-16 bg-warm-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-[#1e5b3e] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.26em] font-[family-name:var(--font-inter)]">
            Premium Tea Selection
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-bold text-[#1b211e] mt-2">
            Most Cherished
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-[family-name:var(--font-inter)] text-sm text-[#65706a] sm:text-base">
            Handpicked teas loved by our customers. Discover the finest flavors of nature, in every cup.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {bestSellers.map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} variant="cherished" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link
            to="/shop"
            className="btn-luxury border border-tea-green text-tea-green hover:bg-tea-green hover:text-warm-ivory px-7 py-4 text-xs font-semibold uppercase tracking-widest rounded-none inline-block"
          >
            View All Teas
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
