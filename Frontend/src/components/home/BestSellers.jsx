import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import { fetchProducts } from '../../store/productSlice';
import { IMAGE_URL } from "../../utils/image";

function ProductCard({ product }) {
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
          onClick={() => dispatch(addToCart({ productId, quantity: 1 }))}
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
