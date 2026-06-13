import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlistLocal, selectIsWishlisted } from '../../store/wishlistSlice';
import { fetchProducts } from '../../store/productSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id || product.id;
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));
  const productSlug = product.slug || productId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group luxury-card bg-white rounded-sm overflow-hidden border border-imperial-gold/10"
    >
      {/* Image area */}
      <div
        className="relative aspect-[4/5] overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${productSlug}`)}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]?.startsWith('/uploads/')
              ? `http://localhost:5000${product.images[0]}`
              : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full bg-gradient-to-br ${product.gradient || 'from-tea-green to-tea-green-light'} transition-transform duration-700 group-hover:scale-105 ${product.images && product.images.length > 0 ? 'hidden' : ''}`}
          style={{ minHeight: product.images && product.images.length > 0 ? 0 : '100%' }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleWishlistLocal(productId));
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-deep-walnut/40'
            }`}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart({ productId, quantity: 1 }));
            }}
            className="w-full rounded-none bg-tea-green hover:bg-tea-green-light text-warm-ivory h-10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-deep-walnut/40 text-[10px] uppercase tracking-wider font-[family-name:var(--font-inter)] font-medium">
            {product.origin}
          </span>
        </div>
        <h3
          className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-1 cursor-pointer hover:text-tea-green transition-colors"
          onClick={() => navigate(`/product/${productSlug}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating || 0)
                  ? 'text-imperial-gold fill-imperial-gold'
                  : 'text-deep-walnut/15 fill-deep-walnut/15'
              }`}
            />
          ))}
          <span className="text-deep-walnut/40 text-[10px] ml-1 font-[family-name:var(--font-inter)]">
            ({product.reviewCount || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-deep-walnut">${product.price}</span>
          {product.comparePrice > product.price && (
            <span className="text-deep-walnut/40 text-sm line-through">
              ${product.comparePrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
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
    <section ref={ref} className="py-20 lg:py-28 bg-warm-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
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
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="btn-luxury border border-tea-green text-tea-green hover:bg-tea-green hover:text-warm-ivory px-8 py-5 text-xs font-semibold uppercase tracking-widest rounded-none inline-block"
          >
            View All Teas
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
