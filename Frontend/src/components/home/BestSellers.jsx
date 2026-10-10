import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, Star, ShoppingBag, Crown, MapPin, Coffee, Thermometer, Timer } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/cartSlice';
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

  if (variant === 'collection') {
    const brewingGuide = product.brewingGuide || {};
    const details = [
      { label: 'Origin', value: product.origin || product.category || 'Selected tea', icon: MapPin },
      { label: 'Caffeine', value: product.caffeine ? `${product.caffeine[0].toUpperCase()}${product.caffeine.slice(1)}` : 'Not specified', icon: Coffee },
      { label: 'Brew', value: brewingGuide.temperature || 'See brew guide', icon: Thermometer },
      { label: 'Steep', value: brewingGuide.steepTime || 'See brew guide', icon: Timer },
    ];

    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e6dc] bg-[#fffefa] shadow-[0_8px_24px_rgba(58,40,28,0.10)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(58,40,28,0.15)] sm:rounded-[26px]"
      >
        <div className="relative">
          <Link
            to={`/product/${productSlug}`}
            aria-label={`View ${product.name}`}
            className="flex aspect-square items-center justify-center overflow-hidden bg-[#eef0df] sm:aspect-[1.28/1]"
          >
            {imageUrl && !imageFailed ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
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
              <span className="inline-flex items-center gap-1 rounded-md border border-white/35 bg-[#07553e] px-1.5 py-1 text-[8px] font-semibold text-white shadow-sm sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs">
                <Crown className="h-3 w-3 text-[#f5d27b] sm:h-3.5 sm:w-3.5" /> Best Seller
              </span>
            )}
            {!product.bestSeller && product.isNew && (
              <span className="rounded-md bg-[#f2d28b] px-1.5 py-1 text-[8px] font-semibold text-[#3a281c] shadow-sm sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs">New Arrival</span>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleWishlist(productId))}
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e9e8df] bg-white/95 shadow-sm transition hover:scale-105 hover:bg-white sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <Heart className={`h-4 w-4 transition-colors sm:h-5 sm:w-5 ${isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-[#263b32]'}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
          <p className="mb-1 line-clamp-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#41695d] sm:text-[11px] sm:tracking-[0.13em]">
            {product.origin || product.category || 'Premium tea'}{product.weight ? ` · ${product.weight}` : ''}
          </p>
          <Link to={`/product/${productSlug}`} className="line-clamp-2 font-[family-name:var(--font-playfair)] text-base font-semibold leading-tight text-[#173b2c] hover:text-tea-green sm:text-2xl">
            {product.name}
          </Link>
          <p className="mt-1.5 line-clamp-2 min-h-8 text-[10px] leading-4 text-[#61756d] sm:mt-2 sm:min-h-10 sm:text-sm sm:leading-5">
            {product.shortDescription || product.description || 'A carefully selected tea for a memorable cup.'}
          </p>

          <Link to={`/product/${productSlug}`} className="mt-1.5 inline-flex min-h-4 min-w-0 items-center gap-1 text-[10px] sm:mt-2 sm:min-h-5 sm:gap-1.5 sm:text-xs" aria-label={`${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.reviewCount || 0} reviews`}>
            <span className="flex items-center" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.round(product.rating || 0) ? 'fill-[#efa900] text-[#efa900]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />
              ))}
            </span>
            <span className="font-medium text-[#263b32]">{Number(product.rating || 0).toFixed(1)}</span>
            <span className="truncate text-[#61756d]">({(product.reviewCount || 0).toLocaleString('en-IN')})</span>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-x-1 gap-y-2 sm:mt-4 sm:grid-cols-4 sm:gap-2">
            {details.map((detail) => (
              <div key={detail.label} className="flex min-w-0 flex-col items-center text-center">
                <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf3e8] text-[#174b35] sm:mb-1.5 sm:h-10 sm:w-10">
                  <detail.icon className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-wide text-[#718177] sm:text-[10px]">{detail.label}</span>
                <span className="line-clamp-2 text-[9px] leading-3 text-[#254337] sm:text-[10px] sm:leading-4">{detail.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 sm:gap-2">
              <span className="text-lg font-bold tracking-tight text-[#164832] sm:text-[27px]">₹{price.toLocaleString('en-IN')}</span>
              {hasDiscount && <span className="shrink-0 text-[10px] text-[#8a918d] line-through sm:text-sm">₹{comparePrice.toLocaleString('en-IN')}</span>}
              {hasDiscount && <span className="ml-auto shrink-0 rounded-full bg-[#fde3df] px-2 py-1 text-[8px] font-semibold text-[#8d392c] sm:px-2.5 sm:text-xs">Save {discount}%</span>}
            </div>
            {isOutOfStock && <p className="mt-1 text-[11px] font-medium text-[#b42318]">Currently unavailable</p>}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => dispatch(addToCart({ productId, productName: product.name, quantity: 1 }))}
              className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[#0c523b] bg-gradient-to-r from-[#0b6948] to-[#07543d] px-2 text-[10px] font-semibold text-white shadow-sm transition hover:from-[#07543d] hover:to-[#064431] disabled:cursor-not-allowed disabled:border-[#bdbdbd] disabled:bg-[#e7e5e4] disabled:text-[#78716c] sm:mt-3 sm:h-11 sm:gap-2 sm:px-3 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              {isOutOfStock ? 'Unavailable' : 'Add to cart'}
            </button>
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
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-deep-walnut/50">
          {product.origin || 'Single-origin tea'}{product.weight ? ` · ${product.weight}` : ''}
        </p>
        <Link
          to={`/product/${productSlug}`}
          className="line-clamp-2 min-h-10 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#1f2937] hover:text-tea-green"
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

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => dispatch(addToCart({ productId, productName: product.name, quantity: 1 }))}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#f5c542] px-3 text-xs font-semibold text-[#27231b] transition-colors hover:bg-[#eab72f] disabled:cursor-not-allowed disabled:bg-[#e7e5e4] disabled:text-[#78716c]"
        >
          <ShoppingBag className="h-4 w-4" />
          {isOutOfStock ? 'Unavailable' : 'Add to cart'}
        </button>
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
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
            Customer Favorites
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3">
            Most Cherished
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
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
