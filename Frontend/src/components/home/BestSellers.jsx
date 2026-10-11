import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, Star, Crown, Sparkles, Flame, ShoppingCart, MapPin, Leaf, Mountain, ShieldCheck, Minus, Plus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import { fetchProducts } from '../../store/productSlice';
import { addToCart, openCart } from '../../store/cartSlice';
import { IMAGE_URL } from "../../utils/image";

function ProductCard({ product, variant = 'default' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id || product.id;
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));
  const productSlug = product.slug || productId;
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const image = product.images?.[0];
  const imageUrl = image?.startsWith('/uploads/') ? `${IMAGE_URL}${image}` : image;
  const packetImage = product.slug === 'himalayan-black-reserve'
    ? '/images/tea-products/kingstea-packets/himalayan-black-reserve-estate.png'
    : product.images?.find((imagePath) => imagePath.includes('/kingstea-packets/')) || '';
  const packetImageUrl = packetImage?.startsWith('/uploads/') ? `${IMAGE_URL}${packetImage}` : packetImage;
  const thumbnailUrl = packetImageUrl || imageUrl;
  const price = Number(product.price || 0);
  const comparePrice = Number(product.comparePrice || 0);
  const hasDiscount = comparePrice > price;
  const discount = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const isOutOfStock = product.inStock === false;
  const openProduct = (event) => {
    if (event.target.closest('a, button')) return;
    navigate(`/product/${productSlug}`);
  };
  const openProductFromKeyboard = (event) => {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    navigate(`/product/${productSlug}`);
  };

  if (variant === 'collection') {
    const features = [
      { icon: Leaf, label: 'Premium Quality' },
      { icon: Mountain, label: product.origin || 'Tea Origin' },
      { icon: Sparkles, label: 'Rich Aroma' },
      { icon: ShieldCheck, label: 'Trusted Brand' },
    ];
    const addCollectionProductToCart = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isOutOfStock) return;
      dispatch(addToCart({
        productId,
        productName: product.name,
        price,
        image: thumbnailUrl,
        weight: product.weight,
        quantity,
      }));
      dispatch(openCart());
    };
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={openProduct}
        onKeyDown={openProductFromKeyboard}
        tabIndex={0}
        aria-label={`View ${product.name}`}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#e9e6da] bg-[#fffefa] shadow-[0_12px_34px_rgba(58,40,28,0.11)] transition-shadow duration-200 hover:shadow-[0_18px_44px_rgba(58,40,28,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174b35] sm:rounded-[34px]"
      >
        <div className="relative p-3 pb-0 sm:p-4 sm:pb-0">
          <Link
            to={`/product/${productSlug}`}
            aria-label={`View ${product.name}`}
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[22px] bg-[#e9eadb] sm:rounded-[27px]"
          >
            {thumbnailUrl && !imageFailed ? (
              <img
                src={thumbnailUrl}
                alt={`${product.name} King's Tea packet`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                style={product.slug === 'himalayan-black-reserve' ? { objectPosition: 'center 51%' } : undefined}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#dfe8d2] to-[#a8c19b]">
                <span className="font-[family-name:var(--font-playfair)] text-7xl font-semibold text-tea-green/70" aria-hidden="true">{product.name?.charAt(0)}</span>
              </div>
            )}
          </Link>
          <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-[#064b3a] px-3.5 py-2.5 text-xs font-semibold text-white shadow-md sm:left-8 sm:top-8 sm:gap-3 sm:px-6 sm:py-4 sm:text-lg">
            <Leaf className="h-4 w-4 fill-[#f0d27c] text-[#f0d27c] sm:h-6 sm:w-6" />
            {product.category || 'Premium Tea'}
          </span>
          <button
            onClick={() => dispatch(toggleWishlist(productId))}
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white shadow-md transition-transform hover:scale-105 sm:right-8 sm:top-8 sm:h-14 sm:w-14"
          >
            <Heart className={`h-5 w-5 sm:h-8 sm:w-8 ${isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-[#173f35]'}`} />
          </button>
        </div>

        <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4 sm:px-10 sm:pb-9 sm:pt-7">
          <Leaf aria-hidden="true" className="pointer-events-none absolute -right-4 top-12 h-40 w-40 rotate-[25deg] text-[#778d5b]/[0.055] sm:-right-2 sm:top-16 sm:h-64 sm:w-64" strokeWidth={0.7} />
          <div className="relative mb-3 flex items-center gap-3 sm:mb-5 sm:gap-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#c99c35] text-[#b9871b] sm:h-14 sm:w-14 sm:border-[3px]">
              <Leaf className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.5} />
            </span>
            <span className="font-sans text-xs font-semibold tracking-[0.22em] text-[#07553e] sm:text-xl sm:tracking-[0.26em]">KING'S TEA</span>
          </div>
          <Link to={`/product/${productSlug}`} className="relative font-[family-name:var(--font-playfair)] text-[25px] font-semibold leading-[1.08] text-[#073b2d] hover:text-tea-green sm:text-[38px]">
            {product.name}
          </Link>
          <p className="relative mt-2 line-clamp-2 text-sm leading-5 text-[#52635b] sm:mt-3 sm:text-xl sm:leading-7">
            {product.shortDescription || product.description || 'A carefully selected tea for a memorable cup.'}
          </p>

          <Link to={`/product/${productSlug}`} className="relative mt-3 inline-flex min-w-0 items-center gap-1.5 sm:mt-5 sm:gap-3" aria-label={`${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.reviewCount || 0} reviews`}>
            <span className="flex items-center" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 sm:h-7 sm:w-7 ${i < Math.round(product.rating || 0) ? 'fill-[#dca32a] text-[#dca32a]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />)}
            </span>
            <span className="text-xs font-semibold text-[#34483f] sm:text-xl">{Number(product.rating || 0).toFixed(1)}</span>
            <span className="truncate text-xs text-[#78827d] sm:text-lg">({(product.reviewCount || 0).toLocaleString('en-IN')} reviews)</span>
          </Link>

          <div className="relative mt-4 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-7 sm:gap-x-5">
            <span className="text-[28px] font-bold tracking-tight text-[#07553e] sm:text-[48px]">{'\u20B9'}{price.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className="text-sm text-[#8a918d] line-through sm:text-2xl">{'\u20B9'}{comparePrice.toLocaleString('en-IN')}</span>}
            {hasDiscount && <span className="rounded-full bg-[#e1eadb] px-2.5 py-1 text-[10px] font-semibold text-[#07553e] sm:px-4 sm:py-2 sm:text-lg">{discount}% OFF</span>}
          </div>

          <div className="relative mt-4 grid grid-cols-4 rounded-[20px] bg-[#f3f5ec]/90 px-1 py-3 sm:mt-7 sm:rounded-[28px] sm:px-3 sm:py-5">
            {features.map(({ icon: FeatureIcon, label }, index) => (
              <div key={`${label}-${index}`} className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-center text-[9px] font-medium leading-tight text-[#183d33] sm:gap-2 sm:px-2 sm:text-base ${index ? 'border-l border-[#d9dfd1]' : ''}`}>
                <FeatureIcon className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.7} />
                <span className="line-clamp-2">{label}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-auto flex items-stretch gap-2.5 pt-4 sm:gap-5 sm:pt-7">
            <div className="flex h-12 shrink-0 items-center rounded-full border border-[#e7e8dd] bg-white p-1 shadow-sm sm:h-[76px] sm:p-2">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center text-[#063d30] sm:h-14 sm:w-14">
                <Minus className="h-4 w-4 sm:h-7 sm:w-7" />
              </button>
              <span className="flex h-full min-w-8 items-center justify-center border-x border-[#ecece5] px-2 text-sm font-semibold text-[#203a32] sm:min-w-14 sm:px-4 sm:text-2xl">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center text-[#063d30] sm:h-14 sm:w-14">
                <Plus className="h-4 w-4 sm:h-7 sm:w-7" />
              </button>
            </div>
            <button
              type="button"
              onClick={addCollectionProductToCart}
              disabled={isOutOfStock}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#063e31] px-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(6,62,49,0.18)] transition hover:bg-[#07553e] disabled:cursor-not-allowed disabled:bg-[#7b8781] sm:min-h-[76px] sm:gap-4 sm:px-6 sm:text-2xl"
            >
              <ShoppingCart className="h-5 w-5 sm:h-8 sm:w-8" />
              {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === 'cherished') {
    const isCherished = variant === 'cherished';
    const addProductToCart = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isOutOfStock) return;
      dispatch(addToCart({
        productId,
        productName: product.name,
        price,
        image: thumbnailUrl,
        weight: product.weight,
        quantity: 1,
      }));
      dispatch(openCart());
    };
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={openProduct}
        onKeyDown={openProductFromKeyboard}
        tabIndex={0}
        aria-label={`View ${product.name}`}
        className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#e8e6dc] bg-[#fffefa] shadow-[0_8px_24px_rgba(58,40,28,0.10)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(58,40,28,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174b35] ${isCherished ? 'sm:rounded-[22px]' : 'sm:rounded-[15px]'}`}
      >
        <div className={`relative ${isCherished ? '' : 'bg-[#e7e9db]'}`}>
          <Link
            to={`/product/${productSlug}`}
            aria-label={`View ${product.name}`}
            className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#e7e9db]"
          >
            {thumbnailUrl && !imageFailed ? (
              <img
                src={thumbnailUrl}
                alt={`${product.name} King's Tea packet`}
                className={product.slug === 'himalayan-black-reserve'
                  ? 'h-full w-full object-contain'
                  : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'}
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

          {!isCherished && <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-[#073b2d]/90 px-2 py-1 text-[9px] font-semibold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:text-[10px]">{product.category || 'Premium Tea'}</span>}
          {isCherished && <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5 sm:left-4 sm:top-4">
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
          </div>}

          <button
            onClick={() => dispatch(toggleWishlist(productId))}
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className={`absolute right-2 top-2 z-[2] flex h-8 w-8 items-center justify-center rounded-full border border-[#e9e8df] bg-white/95 shadow-sm transition hover:scale-105 hover:bg-white sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${isCherished ? 'sm:h-10 sm:w-10' : ''}`}
          >
            <Heart className={`h-4 w-4 transition-colors sm:h-5 sm:w-5 ${isWishlisted ? 'fill-royal-terracotta text-royal-terracotta' : 'text-[#263b32]'}`} />
          </button>
        </div>

        <div className={`flex flex-1 flex-col pb-3 pt-2 ${isCherished ? 'px-3 sm:px-4 sm:pb-4 sm:pt-3' : 'px-2.5 sm:px-3.5 sm:pb-3 sm:pt-2'}`}>
          {isCherished && <div className="mb-1 flex min-w-0">
            <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34483f] sm:text-xs sm:tracking-[0.12em]">
              {product.origin || product.category || 'Premium tea'}
            </p>
          </div>}
          <Link to={`/product/${productSlug}`} className={`line-clamp-2 min-h-[1.5em] font-[family-name:var(--font-playfair)] font-semibold leading-tight text-[#202923] hover:text-tea-green ${isCherished ? 'text-lg sm:text-[22px]' : 'text-base sm:text-[17px]'}`}>
            {product.name}
          </Link>
          {!isCherished && <Link to={`/product/${productSlug}`} className="mt-1 inline-flex min-w-0 items-center gap-1 text-[9px] sm:gap-1.5 sm:text-[10px]" aria-label={`${Number(product.rating || 0).toFixed(1)} out of 5 stars, ${product.reviewCount || 0} reviews`}>
            <span className="flex items-center" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating || 0) ? 'fill-[#efa900] text-[#efa900]' : 'fill-[#e7e5e4] text-[#e7e5e4]'}`} />)}
            </span>
            <span className="font-medium text-[#263b32]">{Number(product.rating || 0).toFixed(1)}</span>
            <span className="text-[#61756d]">({(product.reviewCount || 0).toLocaleString('en-IN')})</span>
          </Link>}
          <p className={`line-clamp-2 ${isCherished ? 'mt-1 min-h-9 text-xs leading-[18px] sm:mt-1.5 sm:min-h-10 sm:text-sm sm:leading-5' : 'mt-1 min-h-9 text-[11px] leading-[17px] text-[#52635b] sm:min-h-9 sm:text-[12px] sm:leading-[18px]'}`}>
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

          <div className={`mt-1 min-w-0 items-center sm:mt-1.5 flex flex-nowrap justify-between gap-x-1`}>
            <span className={`font-bold tracking-tight text-[#07553e] ${isCherished ? 'shrink-0 text-base leading-none sm:text-2xl' : 'text-lg sm:text-2xl'}`}>{'\u20B9'}{price.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className={`shrink-0 text-[#8a918d] line-through ${isCherished ? 'text-[8px] sm:text-xs' : 'text-[9px] sm:text-xs'}`}>{'\u20B9'}{comparePrice.toLocaleString('en-IN')}</span>}
            {hasDiscount && <span className={`shrink-0 rounded-full bg-[#fde9e6] font-semibold text-[#b3261e] ${isCherished ? 'px-1.5 py-1 text-[7px] sm:px-2.5 sm:text-[10px]' : 'px-2 py-1 text-[8px] sm:px-2.5 sm:text-[9px]'}`}>Save {discount}%</span>}
          </div>

          {!isCherished && <div className="mt-2 flex min-h-8 items-center justify-between gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#edf2e8] px-2 py-1 text-[8px] font-medium text-[#365843] sm:text-[9px]"><Leaf className="h-3 w-3" /> Premium Quality</span>
            {product.origin && <span className="hidden min-w-0 items-center gap-1 truncate text-[9px] text-[#50635a] sm:inline-flex"><MapPin className="h-3 w-3 shrink-0" />{product.origin}</span>}
            <button
              type="button"
              onClick={addProductToCart}
              disabled={isOutOfStock}
              className="ml-auto flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#006447] to-[#002d25] px-2 text-[9px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:from-[#78847c] disabled:to-[#69736c] sm:px-2.5 sm:text-[10px]"
            ><ShoppingCart className="h-3.5 w-3.5" />{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</button>
          </div>}
          {isCherished && isOutOfStock && <p className="mt-auto pt-3 text-[11px] font-medium text-[#b42318]">Currently unavailable</p>}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={openProduct}
      onKeyDown={openProductFromKeyboard}
      tabIndex={0}
      aria-label={`View ${product.name}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[#e7e5e4] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174b35]"
    >
      <div className="relative">
        <Link
          to={`/product/${productSlug}`}
          aria-label={`View ${product.name}`}
          className={`flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#faf9f6] ${product.slug === 'himalayan-black-reserve' ? '' : 'p-2 sm:p-3'}`}
        >
          {thumbnailUrl && !imageFailed ? (
            <img
              src={thumbnailUrl}
              alt={`${product.name} King's Tea packet`}
              className={product.slug === 'himalayan-black-reserve'
                ? 'h-full w-full object-contain'
                : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'}
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

      </div>
    </motion.article>
  );
}

export { ProductCard };

export default function BestSellers({ content = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const taggedBestSellers = products.filter((p) => p.bestSeller);
  const bestSellers = (taggedBestSellers.length ? taggedBestSellers : products.filter((p) => p.featured)).slice(0, Number(content.limit) || 4);

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
            {content.eyebrow || 'Premium Tea Selection'}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-bold text-[#1b211e] mt-2">
            {content.heading || 'Most Cherished'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-[family-name:var(--font-inter)] text-sm text-[#65706a] sm:text-base">
            {content.description || 'Explore the teas currently featured in our collection.'}
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
