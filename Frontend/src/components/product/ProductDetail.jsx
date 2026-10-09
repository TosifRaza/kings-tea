// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   ArrowLeft,
//   Heart,
//   ShoppingBag,
//   Star,
//   Minus,
//   Plus,
//   Thermometer,
//   Clock,
//   Scale,
//   Lightbulb,
// } from 'lucide-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchProductBySlug, fetchProducts } from '../../store/productSlice';
// import { addToCart } from '../../store/cartSlice';
// import { toggleWishlistLocal, selectIsWishlisted } from '../../store/wishlistSlice';

// const mockReviews = [
//   { id: 1, name: 'Eleanor V.', rating: 5, date: 'Oct 15, 2024', comment: 'Absolutely exquisite. The complexity of flavors unfolds with each sip. This is tea at its finest.' },
//   { id: 2, name: 'Marcus T.', rating: 5, date: 'Sep 28, 2024', comment: 'Worth every penny. The brewing guide included was incredibly helpful for getting the perfect cup.' },
//   { id: 3, name: 'Sophia L.', rating: 4, date: 'Sep 12, 2024', comment: 'Beautiful tea with remarkable depth. I prefer a slightly stronger brew but the quality is undeniable.' },
// ];

// const gradientMap = {
//   'from-amber-800 to-amber-600': 'bg-gradient-to-br from-amber-800 to-amber-600',
//   'from-amber-900 to-amber-700': 'bg-gradient-to-br from-amber-900 to-amber-700',
//   'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
//   'from-green-600 to-green-400': 'bg-gradient-to-br from-green-600 to-green-400',
//   'from-green-700 to-green-500': 'bg-gradient-to-br from-green-700 to-green-500',
//   'from-amber-700 to-yellow-600': 'bg-gradient-to-br from-amber-700 to-yellow-600',
//   'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
//   'from-emerald-800 to-emerald-600': 'bg-gradient-to-br from-emerald-800 to-emerald-600',
//   'from-red-900 to-red-700': 'bg-gradient-to-br from-red-900 to-red-700',
//   'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
//   'from-orange-600 to-amber-400': 'bg-gradient-to-br from-orange-600 to-amber-400',
//   'from-green-800 to-green-600': 'bg-gradient-to-br from-green-800 to-green-600',
//   'from-green-500 to-green-300': 'bg-gradient-to-br from-green-500 to-green-300',
//   'from-gray-300 to-gray-100': 'bg-gradient-to-br from-gray-300 to-gray-100',
//   'from-pink-100 to-white': 'bg-gradient-to-br from-pink-100 to-white',
// };

// export default function ProductDetail() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');

//   // ===== ALL HOOKS AT THE TOP — BEFORE ANY CONDITIONAL RETURNS =====
//   const { currentProduct: product, products: allProducts, loading, error } = useSelector((state) => state.products);

//   // Get productId for wishlist (safe even if product is null)
//   const productId = product?._id || product?.id || '';
//   const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));

//   useEffect(() => {
//     if (slug) {
//       dispatch(fetchProductBySlug(slug));
//     }
//     if (!allProducts || allProducts.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, slug]);

//   useEffect(() => {
//     setQuantity(1);
//     setActiveTab('description');
//   }, [slug]);

//   // ===== NOW DO CONDITIONAL RENDERS =====

//   if (loading) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#3A281C]/50">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !product) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#3A281C]/50 mb-4">Failed to load product.</p>
//           <button
//             onClick={() => dispatch(fetchProductBySlug(slug))}
//             className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#3A281C]/50 mb-4">Product not found.</p>
//           <button
//             onClick={() => navigate('/shop')}
//             className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
//           >
//             Back to Shop
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const related = (allProducts || []).filter(
//     (p) => (p._id || p.id) !== productId && p.category === product.category
//   ).slice(0, 3);

//   const gradient = product.gradientColor
//     ? (gradientMap[product.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
//     : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

//   const brewing = product.brewingGuide || {};

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       className="pt-24 pb-16 min-h-screen"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <button
//           onClick={() => navigate('/shop')}
//           className="flex items-center gap-2 text-[#3A281C]/60 hover:text-[#3A281C] transition-colors mb-8 text-sm"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Collection
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
//           {/* Image Gallery */}
//           <div>
//             <div className={`aspect-square rounded-sm overflow-hidden ${gradient} mb-4`}>
//               <div className="w-full h-full flex items-center justify-center">
//                 {product.images && product.images.length > 0 ? (
//                   <img
//                     src={`http://localhost:5000${product.images[0]}`}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-white/20 text-6xl font-bold">
//                     {product.name.charAt(0)}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="grid grid-cols-4 gap-2">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className={`aspect-square rounded-sm overflow-hidden ${gradient} opacity-80 hover:opacity-100 cursor-pointer transition-opacity border-2 ${
//                     i === 1 ? 'border-[#C9A86A]' : 'border-transparent'
//                   }`}
//                 >
//                   <div className="w-full h-full flex items-center justify-center">
//                     {product.images && product.images[i - 1] ? (
                      // 
//                     ) : (
//                       <span className="text-white/20 text-lg font-bold">{i}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div>
//             <div className="flex gap-2 mb-3">
//               {product.isNew && (
//                 <span className="bg-[#C9A86A] text-[#3A281C] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
//                   New
//                 </span>
//               )}
//               {product.bestSeller && (
//                 <span className="bg-[#A65A3A] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
//                   Best Seller
//                 </span>
//               )}
//             </div>

//             <h1 className="text-2xl sm:text-3xl font-bold text-[#3A281C] mb-2">
//               {product.name}
//             </h1>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex gap-0.5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < Math.floor(product.rating || 0) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-[#3A281C]/50 text-xs">
//                 {product.rating || 0} ({product.reviewCount || 0} reviews)
//               </span>
//             </div>

//             <div className="flex items-baseline gap-2 mb-6">
//               <span className="text-2xl font-bold text-[#3A281C]">
//                 ₹{product.price?.toLocaleString()}
//               </span>
//               {product.comparePrice > product.price && (
//                 <span className="text-[#3A281C]/40 text-base line-through">
//                   ₹{product.comparePrice?.toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[#3A281C]/40 text-xs">
//                 / {product.weight}
//               </span>
//             </div>

//             <p className="text-[#3A281C]/70 text-sm leading-relaxed mb-6">
//               {product.shortDescription || product.description?.substring(0, 120)}
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold text-[#3A281C] text-sm mb-2">
//                 Tasting Notes
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {(product.tastingNotes || []).map((note) => (
//                   <span
//                     key={note}
//                     className="bg-[#1F4D3A]/10 text-[#1F4D3A] text-xs px-2 py-0.5 rounded-sm"
//                   >
//                     {note}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-[#F8F3E9] rounded-sm p-4 mb-6">
//               <h3 className="font-semibold text-[#3A281C] text-sm mb-3">
//                 Brewing Guide
//               </h3>
//               <div className="grid grid-cols-3 gap-3 mb-3">
//                 <div className="text-center">
//                   <Thermometer className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Temperature</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.temperature || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <Clock className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Steep Time</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.steepTime || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <Scale className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Amount</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.amount || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//               {brewing.instructions && (
//                 <div className="flex items-start gap-2">
//                   <Lightbulb className="h-4 w-4 text-[#C9A86A] flex-shrink-0 mt-0.5" />
//                   <p className="text-[11px] text-[#3A281C]/60 leading-relaxed">
//                     {brewing.instructions}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center border border-[#C9A86A]/20 rounded-sm">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>
//                 <span className="w-10 text-center text-sm font-medium">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <button
//                 onClick={() => dispatch(addToCart({ productId, quantity }))}
//                 className="flex-1 bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] h-10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
//               >
//                 <ShoppingBag className="h-4 w-4" />
//                 Add to Cart — ₹{(product.price * quantity)?.toLocaleString()}
//               </button>

//               <button
//                 onClick={() => dispatch(toggleWishlistLocal(productId))}
//                 className="h-10 w-10 border border-[#C9A86A]/20 p-0 flex items-center justify-center hover:bg-[#F8F3E9] transition-colors"
//               >
//                 <Heart
//                   className={`h-4 w-4 ${
//                     isWishlisted ? 'fill-[#A65A3A] text-[#A65A3A]' : 'text-[#3A281C]/40'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-3 text-xs text-[#3A281C]/60">
//               <div><span className="text-[#3A281C]/40">Origin:</span> {product.origin}</div>
//               <div><span className="text-[#3A281C]/40">Category:</span> {product.category}</div>
//               <div><span className="text-[#3A281C]/40">Fermentation:</span> {product.fermentation}</div>
//               <div><span className="text-[#3A281C]/40">Caffeine:</span> {product.caffeine}</div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mt-16">
//           <div className="flex border-b border-[#C9A86A]/10 gap-6">
//             {['description', 'reviews', 'related'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-3 text-sm transition-colors ${
//                   activeTab === tab
//                     ? 'border-b-2 border-[#C9A86A] text-[#3A281C] font-medium'
//                     : 'text-[#3A281C]/40 hover:text-[#3A281C]'
//                 }`}
//               >
//                 {tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {activeTab === 'description' && (
//             <div className="mt-8 max-w-3xl">
//               <p className="text-[#3A281C]/70 text-sm leading-relaxed">
//                 {product.description}
//               </p>
//             </div>
//           )}

//           {activeTab === 'reviews' && (
//             <div className="mt-8 space-y-6 max-w-3xl">
//               {mockReviews.map((review) => (
//                 <div key={review.id} className="border-b border-[#C9A86A]/10 pb-6 last:border-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center">
//                         <span className="text-[#1F4D3A] text-xs font-semibold">{review.name.charAt(0)}</span>
//                       </div>
//                       <span className="font-medium text-[#3A281C] text-sm">
//                         {review.name}
//                       </span>
//                     </div>
//                     <span className="text-[#3A281C]/40 text-xs">
//                       {review.date}
//                     </span>
//                   </div>
//                   <div className="flex gap-0.5 mb-2">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-3 w-3 ${
//                           i < review.rating ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-[#3A281C]/70 text-sm leading-relaxed">
//                     {review.comment}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'related' && (
//             <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//               {related.map((p) => {
//                 const relGradient = p.gradientColor
//                   ? (gradientMap[p.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
//                   : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';
//                 return (
//                   <div
//                     key={p._id || p.id}
//                     onClick={() => {
//                       navigate(`/product/${p.slug}`);
//                       window.scrollTo({ top: 0, behavior: 'smooth' });
//                     }}
//                     className="cursor-pointer group bg-white rounded-sm overflow-hidden border border-[#C9A86A]/10 hover:shadow-lg transition-shadow"
//                   >
//                     <div className={`aspect-[4/5] ${relGradient} group-hover:scale-105 transition-transform duration-700 flex items-center justify-center`}>
//                       {p.images && p.images.length > 0 ? (
//                         <img src={`http://localhost:5000${p.images[0]}`} alt={p.name} className="w-full h-full object-cover" />
//                       ) : (
//                         <span className="text-white/20 text-3xl font-bold">{p.name.charAt(0)}</span>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold text-[#3A281C] text-sm mb-1 group-hover:text-[#1F4D3A] transition-colors">
//                         {p.name}
//                       </h3>
//                       <span className="font-semibold text-[#3A281C] text-sm">₹{p.price?.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//               {related.length === 0 && (
//                 <p className="text-[#3A281C]/40 text-sm col-span-3 text-center py-8">
//                   No related products found.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }



// ============================================================
// Frontend/src/components/product/ProductDetail.jsx
// FIXED: Keeps original working logic + adds image gallery + zoom
// ============================================================

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ArrowLeft,
//   Heart,
//   ShoppingBag,
//   Star,
//   Minus,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   X,
//   Thermometer,
//   Clock,
//   Scale,
//   Lightbulb,
// } from 'lucide-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchProductBySlug, fetchProducts } from '../../store/productSlice';
// import { addToCart } from '../../store/cartSlice';
// import { toggleWishlistLocal, selectIsWishlisted } from '../../store/wishlistSlice';
// import { IMAGE_URL,getProductImage } from "../../utils/image";
// // Add to existing imports
// import { fetchProductReviews, submitReview, clearReviewState } from '../../store/reviewSlice';

// const mockReviews = [
//   { id: 1, name: 'Eleanor V.', rating: 5, date: 'Oct 15, 2024', comment: 'Absolutely exquisite. The complexity of flavors unfolds with each sip. This is tea at its finest.' },
//   { id: 2, name: 'Marcus T.', rating: 5, date: 'Sep 28, 2024', comment: 'Worth every penny. The brewing guide included was incredibly helpful for getting the perfect cup.' },
//   { id: 3, name: 'Sophia L.', rating: 4, date: 'Sep 12, 2024', comment: 'Beautiful tea with remarkable depth. I prefer a slightly stronger brew but the quality is undeniable.' },
// ];

// const gradientMap = {
//   'from-amber-800 to-amber-600': 'bg-gradient-to-br from-amber-800 to-amber-600',
//   'from-amber-900 to-amber-700': 'bg-gradient-to-br from-amber-900 to-amber-700',
//   'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
//   'from-green-600 to-green-400': 'bg-gradient-to-br from-green-600 to-green-400',
//   'from-green-700 to-green-500': 'bg-gradient-to-br from-green-700 to-green-500',
//   'from-amber-700 to-yellow-600': 'bg-gradient-to-br from-amber-700 to-yellow-600',
//   'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
//   'from-emerald-800 to-emerald-600': 'bg-gradient-to-br from-emerald-800 to-emerald-600',
//   'from-red-900 to-red-700': 'bg-gradient-to-br from-red-900 to-red-700',
//   'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
//   'from-orange-600 to-amber-400': 'bg-gradient-to-br from-orange-600 to-amber-400',
//   'from-green-800 to-green-600': 'bg-gradient-to-br from-green-800 to-green-600',
//   'from-green-500 to-green-300': 'bg-gradient-to-br from-green-500 to-green-300',
//   'from-gray-300 to-gray-100': 'bg-gradient-to-br from-gray-300 to-gray-100',
//   'from-pink-100 to-white': 'bg-gradient-to-br from-pink-100 to-white',
// };

// export default function ProductDetail() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');

//   // ===== IMAGE GALLERY STATE (NEW) =====
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//   const [zoomStyle, setZoomStyle] = useState({});
//   const [isHovering, setIsHovering] = useState(false);
//   const mainImageRef = useRef(null);
// //  import { IMAGE_URL } from "../../utils/image";

//   // ===== ALL HOOKS AT THE TOP — BEFORE ANY CONDITIONAL RETURNS =====
//   const { currentProduct: product, products: allProducts, loading, error } = useSelector((state) => state.products);

//   // Get productId for wishlist (safe even if product is null)
//   const productId = product?._id || product?.id || '';
//   const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));

//   useEffect(() => {
//     if (slug) {
//       dispatch(fetchProductBySlug(slug));
//     }
//     if (!allProducts || allProducts.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, slug]);

//   useEffect(() => {
//     setQuantity(1);
//     setActiveTab('description');
//     setActiveImageIndex(0); // NEW: reset image index on product change
//   }, [slug]);

//   // ===== IMAGE GALLERY HELPERS (NEW) =====
//   const buildImageList = useCallback(() => {
//     if (!product) return [];

//     if (Array.isArray(product.images) && product.images.length > 0) {
//       return product.images.map((img) =>
//         typeof img === 'string' ? img : img?.url || img?.src || ''
//       ).filter(Boolean);
//     }

//     if (product.image) {
//       return [product.image];
//     }

//     return [];
//   }, [product]);

//   const images = buildImageList();
//   const hasRealImages = images.length > 0;
//   const activeImage = hasRealImages ? images[activeImageIndex] || images[0] : '';

//   // ===== HOVER ZOOM HANDLER (NEW) =====
//   const handleMouseMove = (e) => {
//     if (!mainImageRef.current || !activeImage) return;
//     const rect = mainImageRef.current.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;
//     setZoomStyle({
//       transformOrigin: `${x}% ${y}%`,
//       transform: 'scale(2)',
//     });
//   };

//   const handleMouseEnter = () => {
//     if (window.matchMedia('(min-width: 768px)').matches && hasRealImages) {
//       setIsHovering(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsHovering(false);
//     setZoomStyle({});
//   };

//   // ===== THUMBNAIL NAVIGATION (NEW) =====
//   const goToImage = (index) => {
//     if (index < 0 || index >= images.length) return;
//     setActiveImageIndex(index);
//   };

//   const nextImage = () => {
//     setActiveImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   // ===== KEYBOARD NAVIGATION (NEW) =====
//   useEffect(() => {
//     if (!isLightboxOpen) return;
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') setIsLightboxOpen(false);
//       if (e.key === 'ArrowRight') nextImage();
//       if (e.key === 'ArrowLeft') prevImage();
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     document.body.style.overflow = 'hidden';
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = '';
//     };
//     // eslint-disable-next-line
//   }, [isLightboxOpen, images.length]);

//   // ===== CART HANDLER =====
//   const handleAddToCart = () => {
//     dispatch(addToCart({ productId, quantity }));
//   };

//   // ===== NOW DO CONDITIONAL RENDERS (SAME AS ORIGINAL — DO NOT CHANGE) =====

//   if (loading) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#3A281C]/50">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !product) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#3A281C]/50 mb-4">Failed to load product.</p>
//           <button
//             onClick={() => dispatch(fetchProductBySlug(slug))}
//             className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#3A281C]/50 mb-4">Product not found.</p>
//           <button
//             onClick={() => navigate('/shop')}
//             className="bg-[#1F4D3A] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#1F4D3A]/90"
//           >
//             Back to Shop
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const related = (allProducts || []).filter(
//     (p) => (p._id || p.id) !== productId && p.category === product.category
//   ).slice(0, 3);

//   const gradient = product.gradientColor
//     ? (gradientMap[product.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
//     : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

//   const brewing = product.brewingGuide || {};
//     const { items: reviews, total: reviewTotal, loading: reviewsLoading, submitting, error: reviewError, submitted } = 
//       useSelector((state) => state.reviews);
//     const { user, isAuthenticated } = useSelector((state) => state.auth); // adjust based on your auth slice

//     const [reviewForm, setReviewForm] = useState({
//         rating: 5,
//         title: '',
//         comment: '',
//       });
//       const [showReviewForm, setShowReviewForm] = useState(false);
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       className="pt-24 pb-16 min-h-screen"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <button
//           onClick={() => navigate('/shop')}
//           className="flex items-center gap-2 text-[#3A281C]/60 hover:text-[#3A281C] transition-colors mb-8 text-sm"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Collection
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
//           {/* ============ IMAGE GALLERY (NEW — with thumbnails + zoom) ============ */}
//           <div>
//             {/* Main Image Container */}
//             <div className="flex flex-col-reverse lg:flex-row gap-4">
//               {/* Thumbnails (only show if more than 1 image) */}
//               {hasRealImages && images.length > 1 && (
//                 <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:max-h-[600px]">
//                   {images.map((img, idx) => (
//                     <button
//                       key={`${img}-${idx}`}
//                       type="button"
//                       onClick={() => goToImage(idx)}
//                       aria-label={`View image ${idx + 1}`}
//                       className={`
//                         flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden
//                         border-2 transition-all duration-200
//                         ${idx === activeImageIndex
//                           ? 'border-[#C9A86A] ring-2 ring-[#C9A86A]/30 scale-105'
//                           : 'border-[#C9A86A]/20 hover:border-[#C9A86A]/60 opacity-70 hover:opacity-100'
//                         }
//                       `}
//                     >
//                       <img
//                         src={img.startsWith('http') ? img : `${IMAGE_URL}${img}`}
//                         // src={`${IMAGE_URL}${item.product.images[0]}`}
//                         alt={`${product.name} thumbnail ${idx + 1}`}
//                         className="w-full h-full object-cover"
//                         loading="lazy"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {/* Main Image Display */}
//               <div className="flex-1 relative group">
//                 <motion.div
//                   key={activeImageIndex}
//                   initial={{ opacity: 0.3 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.25 }}
//                   className={`relative aspect-square rounded-sm overflow-hidden ${gradient} ${
//                     hasRealImages ? 'cursor-zoom-in' : ''
//                   }`}
//                   ref={mainImageRef}
//                   onMouseMove={handleMouseMove}
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}
//                   onClick={() => hasRealImages && setIsLightboxOpen(true)}
//                 >
//                   <div className="w-full h-full flex items-center justify-center">
//                     {hasRealImages ? (
//                       <img
//                         src={activeImage.startsWith('http') ? activeImage : `${IMAGE_URL}${activeImage}`}
//                         alt={product.name}
//                         className="w-full h-full object-cover transition-transform duration-200 ease-out"
//                         style={isHovering ? zoomStyle : {}}
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     ) : (
//                       <span className="text-white/20 text-6xl font-bold">
//                         {product.name.charAt(0)}
//                       </span>
//                     )}
//                   </div>

//                   {/* Zoom hint badge (desktop, only if real images) */}
//                   {hasRealImages && (
//                     <div className="absolute top-4 right-4 hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
//                       <ZoomIn className="w-3.5 h-3.5 text-[#3A281C]" />
//                       <span className="text-xs text-[#3A281C]/70">Hover to zoom</span>
//                     </div>
//                   )}

//                   {/* Tap-to-zoom hint (mobile, only if real images) */}
//                   {hasRealImages && (
//                     <div className="absolute top-4 right-4 md:hidden flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
//                       <ZoomIn className="w-3.5 h-3.5 text-[#3A281C]" />
//                       <span className="text-xs text-[#3A281C]/70">Tap</span>
//                     </div>
//                   )}

//                   {/* Navigation arrows (desktop, only if multiple images) */}
//                   {hasRealImages && images.length > 1 && (
//                     <>
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           prevImage();
//                         }}
//                         aria-label="Previous image"
//                         className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <ChevronLeft className="w-5 h-5 text-[#3A281C]" />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           nextImage();
//                         }}
//                         aria-label="Next image"
//                         className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <ChevronRight className="w-5 h-5 text-[#3A281C]" />
//                       </button>
//                     </>
//                   )}

//                   {/* Image counter */}
//                   {hasRealImages && images.length > 1 && (
//                     <div className="absolute bottom-4 right-4 bg-[#3A281C]/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
//                       {activeImageIndex + 1} / {images.length}
//                     </div>
//                   )}
//                 </motion.div>
//               </div>
//             </div>
//           </div>

//           {/* Product Info (UNCHANGED FROM ORIGINAL) */}
//           <div>
//             <div className="flex gap-2 mb-3">
//               {product.isNew && (
//                 <span className="bg-[#C9A86A] text-[#3A281C] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
//                   New
//                 </span>
//               )}
//               {product.bestSeller && (
//                 <span className="bg-[#A65A3A] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
//                   Best Seller
//                 </span>
//               )}
//             </div>

//             <h1 className="text-2xl sm:text-3xl font-bold text-[#3A281C] mb-2">
//               {product.name}
//             </h1>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex gap-0.5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < Math.floor(product.rating || 0) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-[#3A281C]/50 text-xs">
//                 {product.rating || 0} ({product.reviewCount || 0} reviews)
//               </span>
//             </div>

//             <div className="flex items-baseline gap-2 mb-6">
//               <span className="text-2xl font-bold text-[#3A281C]">
//                 ₹{product.price?.toLocaleString()}
//               </span>
//               {product.comparePrice > product.price && (
//                 <span className="text-[#3A281C]/40 text-base line-through">
//                   ₹{product.comparePrice?.toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[#3A281C]/40 text-xs">
//                 / {product.weight}
//               </span>
//             </div>

//             <p className="text-[#3A281C]/70 text-sm leading-relaxed mb-6">
//               {product.shortDescription || product.description?.substring(0, 120)}
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold text-[#3A281C] text-sm mb-2">
//                 Tasting Notes
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {(product.tastingNotes || []).map((note) => (
//                   <span
//                     key={note}
//                     className="bg-[#1F4D3A]/10 text-[#1F4D3A] text-xs px-2 py-0.5 rounded-sm"
//                   >
//                     {note}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-[#F8F3E9] rounded-sm p-4 mb-6">
//               <h3 className="font-semibold text-[#3A281C] text-sm mb-3">
//                 Brewing Guide
//               </h3>
//               <div className="grid grid-cols-3 gap-3 mb-3">
//                 <div className="text-center">
//                   <Thermometer className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Temperature</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.temperature || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <Clock className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Steep Time</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.steepTime || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <Scale className="h-4 w-4 text-[#A65A3A] mx-auto mb-1" />
//                   <p className="text-[10px] text-[#3A281C]/50">Amount</p>
//                   <p className="text-xs text-[#3A281C] font-medium">
//                     {brewing.amount || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//               {brewing.instructions && (
//                 <div className="flex items-start gap-2">
//                   <Lightbulb className="h-4 w-4 text-[#C9A86A] flex-shrink-0 mt-0.5" />
//                   <p className="text-[11px] text-[#3A281C]/60 leading-relaxed">
//                     {brewing.instructions}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center border border-[#C9A86A]/20 rounded-sm">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>
//                 <span className="w-10 text-center text-sm font-medium">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 flex items-center justify-center text-[#3A281C]/60 hover:text-[#3A281C] transition-colors"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 className="flex-1 bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] h-10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
//               >
//                 <ShoppingBag className="h-4 w-4" />
//                 Add to Cart — ₹{(product.price * quantity)?.toLocaleString()}
//               </button>

//               <button
//                 onClick={() => dispatch(toggleWishlistLocal(productId))}
//                 className="h-10 w-10 border border-[#C9A86A]/20 p-0 flex items-center justify-center hover:bg-[#F8F3E9] transition-colors"
//               >
//                 <Heart
//                   className={`h-4 w-4 ${
//                     isWishlisted ? 'fill-[#A65A3A] text-[#A65A3A]' : 'text-[#3A281C]/40'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-3 text-xs text-[#3A281C]/60">
//               <div><span className="text-[#3A281C]/40">Origin:</span> {product.origin}</div>
//               <div><span className="text-[#3A281C]/40">Category:</span> {product.category}</div>
//               <div><span className="text-[#3A281C]/40">Fermentation:</span> {product.fermentation}</div>
//               <div><span className="text-[#3A281C]/40">Caffeine:</span> {product.caffeine}</div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs (UNCHANGED FROM ORIGINAL) */}
//         <div className="mt-16">
//           <div className="flex border-b border-[#C9A86A]/10 gap-6">
//             {['description', 'reviews', 'related'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-3 text-sm transition-colors ${
//                   activeTab === tab
//                     ? 'border-b-2 border-[#C9A86A] text-[#3A281C] font-medium'
//                     : 'text-[#3A281C]/40 hover:text-[#3A281C]'
//                 }`}
//               >
//                 {tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {activeTab === 'description' && (
//             <div className="mt-8 max-w-3xl">
//               <p className="text-[#3A281C]/70 text-sm leading-relaxed">
//                 {product.description}
//               </p>
//             </div>
//           )}

//           {activeTab === 'reviews' && (
//             <div className="mt-8 space-y-6 max-w-3xl">
//               {mockReviews.map((review) => (
//                 <div key={review.id} className="border-b border-[#C9A86A]/10 pb-6 last:border-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center">
//                         <span className="text-[#1F4D3A] text-xs font-semibold">{review.name.charAt(0)}</span>
//                       </div>
//                       <span className="font-medium text-[#3A281C] text-sm">
//                         {review.name}
//                       </span>
//                     </div>
//                     <span className="text-[#3A281C]/40 text-xs">
//                       {review.date}
//                     </span>
//                   </div>
//                   <div className="flex gap-0.5 mb-2">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-3 w-3 ${
//                           i < review.rating ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-[#3A281C]/70 text-sm leading-relaxed">
//                     {review.comment}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'related' && (
//             <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//               {related.map((p) => {
//                 const relGradient = p.gradientColor
//                   ? (gradientMap[p.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
//                   : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';
//                 return (
//                   <div
//                     key={p._id || p.id}
//                     onClick={() => {
//                       navigate(`/product/${p.slug}`);
//                       window.scrollTo({ top: 0, behavior: 'smooth' });
//                     }}
//                     className="cursor-pointer group bg-white rounded-sm overflow-hidden border border-[#C9A86A]/10 hover:shadow-lg transition-shadow"
//                   >
//                     <div className={`aspect-[4/5] ${relGradient} group-hover:scale-105 transition-transform duration-700 flex items-center justify-center`}>
//                       {p.images && p.images.length > 0 ? (
//                         <img
//                           // src={p.images[0].startsWith('http') ? p.images[0] : `${IMAGE_URL}${p.images[0]}`}
//                           src={getProductImage(p.images[0])}
//                           alt={p.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-white/20 text-3xl font-bold">{p.name.charAt(0)}</span>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold text-[#3A281C] text-sm mb-1 group-hover:text-[#1F4D3A] transition-colors">
//                         {p.name}
//                       </h3>
//                       <span className="font-semibold text-[#3A281C] text-sm">₹{p.price?.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//               {related.length === 0 && (
//                 <p className="text-[#3A281C]/40 text-sm col-span-3 text-center py-8">
//                   No related products found.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ============ LIGHTBOX (NEW — fullscreen image viewer) ============ */}
//       <AnimatePresence>
//         {isLightboxOpen && hasRealImages && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
//             onClick={() => setIsLightboxOpen(false)}
//           >
//             <button
//               type="button"
//               onClick={() => setIsLightboxOpen(false)}
//               className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
//               aria-label="Close lightbox"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
//               {activeImageIndex + 1} / {images.length}
//             </div>

//             {images.length > 1 && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   prevImage();
//                 }}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
//                 aria-label="Previous image"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//             )}

//             <motion.img
//               key={activeImageIndex}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               src={activeImage.startsWith('http') ? activeImage : `${IMAGE_URL}${activeImage}`}
//               alt={`${product.name} full view`}
//               className="max-w-[90vw] max-h-[85vh] object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />

//             {images.length > 1 && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   nextImage();
//                 }}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
//                 aria-label="Next image"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             )}

//             {images.length > 1 && (
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-white/5 rounded-lg backdrop-blur-sm">
//                 {images.map((img, idx) => (
//                   <button
//                     key={`lightbox-${idx}`}
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       goToImage(idx);
//                     }}
//                     className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-all ${
//                       idx === activeImageIndex
//                         ? 'border-[#C9A86A] opacity-100'
//                         : 'border-transparent opacity-50 hover:opacity-80'
//                     }`}
//                   >
//                     <img
//                       src={img.startsWith('http') ? img : `${IMAGE_URL}${img}`}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }



























import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Thermometer,
  Clock,
  Scale,
  Lightbulb,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductBySlug, fetchProducts } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import { getProductImage } from "../../utils/image";
// Add to existing imports
import { fetchProductReviews, submitReview, clearReviewState } from '../../store/reviewSlice';


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

  // ===== IMAGE GALLERY STATE (NEW) =====
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//  import { IMAGE_URL } from "../../utils/image";

  // ===== ALL HOOKS AT THE TOP — BEFORE ANY CONDITIONAL RETURNS =====
  const { currentProduct: product, products: allProducts, loading, error } = useSelector((state) => state.products);

  // Get productId for wishlist (safe even if product is null)
  const productId = product?._id || product?.id || '';
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, productId));

  // ===== REVIEWS HOOKS (MOVED HERE — must be before conditional returns) =====
  const { items: reviews, total: reviewTotal, loading: reviewsLoading, submitting, error: reviewError, submitted } =
    useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth); // adjust based on your auth slice

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');

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
    setActiveImageIndex(0); // NEW: reset image index on product change
    setReviewRatingFilter('all');
    setReviewSort('newest');
  }, [slug]);

  // ===== FETCH REVIEWS WHEN PRODUCT LOADS (NEW) =====
  useEffect(() => {
    if (product?._id) {
      dispatch(fetchProductReviews(product._id));
    }
    return () => {
      dispatch(clearReviewState());
    };
  }, [product?._id, dispatch]);

  // ===== IMAGE GALLERY HELPERS (NEW) =====
  const buildImageList = useCallback(() => {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map((img) =>
        typeof img === 'string' ? img : img?.url || img?.src || ''
      ).filter(Boolean);
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  const images = buildImageList();
  const hasRealImages = images.length > 0;
  const activeImage = hasRealImages ? images[activeImageIndex] || images[0] : '';

  // ===== THUMBNAIL NAVIGATION (NEW) =====
  const goToImage = (index) => {
    if (index < 0 || index >= images.length) return;
    setActiveImageIndex(index);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // ===== KEYBOARD NAVIGATION (NEW) =====
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line
  }, [isLightboxOpen, images.length]);

  // ===== CART HANDLER =====
  const handleAddToCart = () => {
    dispatch(addToCart({ productId, quantity }));
  };

  // ===== REVIEW SUBMIT HANDLER (NEW) =====
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/product/${slug}`));
      return;
    }

    const result = await dispatch(submitReview({
      productId: product._id,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
    }));

    if (submitReview.fulfilled.match(result)) {
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      // Refetch product to update rating display
      dispatch(fetchProductBySlug(slug));
    }
  };

  // ===== NOW DO CONDITIONAL RENDERS (SAME AS ORIGINAL — DO NOT CHANGE) =====

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

  const configuredRelated = Array.isArray(product.relatedProducts)
    ? product.relatedProducts.filter((p) => p && typeof p === 'object' && (p._id || p.id))
    : [];
  const automaticRelated = (allProducts || [])
    .filter((p) => (p._id || p.id) !== productId)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category));
  const related = (configuredRelated.length ? configuredRelated : automaticRelated).slice(0, 10);
  const reviewItems = Array.isArray(reviews) ? reviews : [];
  const reviewBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewItems.filter((review) => Number(review.rating) === rating).length,
  }));
  const visibleReviews = reviewItems
    .filter((review) => reviewRatingFilter === 'all' || Number(review.rating) === Number(reviewRatingFilter))
    .sort((a, b) => {
      if (reviewSort === 'highest') return Number(b.rating) - Number(a.rating);
      if (reviewSort === 'lowest') return Number(a.rating) - Number(b.rating);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const gradient = product.gradientColor
    ? (gradientMap[product.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
    : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

  const brewing = product.brewingGuide || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-20 pb-12 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-[#3A281C]/60 hover:text-[#3A281C] transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ============ IMAGE GALLERY (NEW — with thumbnails + zoom) ============ */}
          <div>
            {/* Main Image Container */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnails (only show if more than 1 image) */}
              {hasRealImages && images.length > 1 && (
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:max-h-[600px]">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => goToImage(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`
                        flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden
                        border-2 transition-all duration-200
                        ${idx === activeImageIndex
                          ? 'border-[#C9A86A] ring-2 ring-[#C9A86A]/30 scale-105'
                          : 'border-[#C9A86A]/20 hover:border-[#C9A86A]/60 opacity-70 hover:opacity-100'
                        }
                      `}
                    >
                      <img
                        src={getProductImage(img)}
                        // src={`${IMAGE_URL}${item.product.images[0]}`}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display */}
              <div className="flex-1 relative group">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/5] overflow-hidden bg-[#F8F3E9] cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  {hasRealImages ? (
                    <img
                      src={getProductImage(activeImage)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${gradient} flex items-center justify-center`}>
                      <span className="text-white/30 text-6xl font-bold font-[family-name:var(--font-playfair)]">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Zoom indicator badge */}
                  {hasRealImages && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                      <ZoomIn className="h-4 w-4 text-[#3A281C]" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-[#C9A86A] text-[#3A281C] text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-sm">
                        New
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="bg-[#A65A3A] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-sm">
                        Best Seller
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ============ PRODUCT INFO ============ */}
          <div>
            <div className="mb-6">
              <span className="text-[#C9A86A] text-xs font-semibold uppercase tracking-[0.2em]">
                {product.origin || 'Premium Tea'}
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#3A281C] mt-2 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#3A281C]/15'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#3A281C]/60 text-sm">
                  {product.rating || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#3A281C]">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-[#3A281C]/40 text-lg line-through">
                    ₹{product.comparePrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[#3A281C]/70 text-sm leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#3A281C] text-sm mb-2">Tasting Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tastingNotes.map((note, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#1F4D3A]/5 text-[#1F4D3A] px-3 py-1 rounded-sm border border-[#1F4D3A]/10"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-[#C9A86A]/30 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F3E9] transition-colors"
                  >
                    <Minus className="h-4 w-4 text-[#3A281C]" />
                  </button>
                  <span className="w-12 text-center font-semibold text-[#3A281C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F3E9] transition-colors"
                  >
                    <Plus className="h-4 w-4 text-[#3A281C]" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] py-3 px-6 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  // onClick={() => dispatch(toggleWishlistLocal(productId))}
                  onClick={() => dispatch(toggleWishlist(productId))}
                  className="w-12 h-12 border border-[#C9A86A]/30 hover:border-[#A65A3A] flex items-center justify-center transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted ? 'fill-[#A65A3A] text-[#A65A3A]' : 'text-[#3A281C]/40'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#C9A86A]/10">
              <div>
                <span className="text-[#3A281C]/50 text-xs uppercase tracking-wider">Weight</span>
                <p className="text-[#3A281C] text-sm font-medium mt-1">{product.weight || '100g'}</p>
              </div>
              <div>
                <span className="text-[#3A281C]/50 text-xs uppercase tracking-wider">Origin</span>
                <p className="text-[#3A281C] text-sm font-medium mt-1">{product.origin || 'India'}</p>
              </div>
              <div>
                <span className="text-[#3A281C]/50 text-xs uppercase tracking-wider">Caffeine</span>
                <p className="text-[#3A281C] text-sm font-medium mt-1">{product.caffeine || 'Medium'}</p>
              </div>
              <div>
                <span className="text-[#3A281C]/50 text-xs uppercase tracking-wider">Fermentation</span>
                <p className="text-[#3A281C] text-sm font-medium mt-1">{product.fermentation || 'Full'}</p>
              </div>
            </div>

            {/* Brewing Guide */}
            {brewing && (brewing.temperature || brewing.steepTime || brewing.amount) && (
              <div className="mt-6 p-6 bg-[#F8F3E9] rounded-sm border border-[#C9A86A]/10">
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#3A281C] mb-4">
                  Brewing Guide
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {brewing.temperature && (
                    <div className="text-center">
                      <Thermometer className="h-5 w-5 text-[#1F4D3A] mx-auto mb-2" />
                      <div className="text-[#3A281C] font-semibold text-sm">{brewing.temperature}</div>
                      <div className="text-[#3A281C]/50 text-xs">Temperature</div>
                    </div>
                  )}
                  {brewing.steepTime && (
                    <div className="text-center">
                      <Clock className="h-5 w-5 text-[#1F4D3A] mx-auto mb-2" />
                      <div className="text-[#3A281C] font-semibold text-sm">{brewing.steepTime}</div>
                      <div className="text-[#3A281C]/50 text-xs">Steep Time</div>
                    </div>
                  )}
                  {brewing.amount && (
                    <div className="text-center">
                      <Scale className="h-5 w-5 text-[#1F4D3A] mx-auto mb-2" />
                      <div className="text-[#3A281C] font-semibold text-sm">{brewing.amount}</div>
                      <div className="text-[#3A281C]/50 text-xs">Amount</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ TABS SECTION ============ */}
        <div className="mt-12">
          <div className="flex gap-8 border-b border-[#C9A86A]/10">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#1F4D3A]'
                    : 'text-[#3A281C]/50 hover:text-[#3A281C]'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F4D3A]"
                  />
                )}
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

              {/* ===== RATING SUMMARY (NEW) ===== */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-6 pb-6 border-b border-[#C9A86A]/10">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold text-[#3A281C] mb-2 font-[family-name:var(--font-playfair)]">
                    {product.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating || 0)
                            ? 'text-[#C9A86A] fill-[#C9A86A]'
                            : 'text-[#3A281C]/15'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#3A281C]/50 text-sm">
                    Based on {product.reviewCount || 0} reviews
                  </p>
                </div>

                <div className="space-y-2" aria-label="Review rating breakdown">
                  {reviewBreakdown.map(({ rating, count }) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewRatingFilter(reviewRatingFilter === String(rating) ? 'all' : String(rating))}
                      aria-pressed={reviewRatingFilter === String(rating)}
                      className={`grid w-full grid-cols-[42px_minmax(0,1fr)_32px] items-center gap-2 rounded px-1 py-0.5 text-left text-xs transition ${reviewRatingFilter === String(rating) ? 'bg-[#1F4D3A]/5' : 'hover:bg-[#3A281C]/[0.03]'}`}
                    >
                      <span className="inline-flex items-center gap-1 text-[#3A281C]/65">{rating}<Star className="h-3 w-3 fill-[#C9A86A] text-[#C9A86A]" /></span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-[#3A281C]/10"><span className="block h-full rounded-full bg-[#C9A86A]" style={{ width: `${reviewItems.length ? (count / reviewItems.length) * 100 : 0}%` }} /></span>
                      <span className="text-right text-[#3A281C]/45">{count}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 md:col-span-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => document.getElementById('customer-review-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="rounded-sm border border-[#1F4D3A]/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F4D3A] hover:bg-[#1F4D3A]/5"
                  >
                    View reviews ({reviewTotal})
                  </button>
                  {isAuthenticated ? (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="rounded-sm bg-[#1F4D3A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F8F3E9] transition-colors hover:bg-[#1F4D3A]/90"
                    >
                      {showReviewForm ? 'Cancel' : 'Write a Review'}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login?redirect=' + encodeURIComponent(`/product/${slug}`))}
                      className="rounded-sm bg-[#1F4D3A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F8F3E9] transition-colors hover:bg-[#1F4D3A]/90"
                    >
                      Login to Write a Review
                    </button>
                  )}
                </div>
              </div>

              {/* ===== REVIEW FORM (NEW — collapsible) ===== */}
              {showReviewForm && isAuthenticated && (
                <form onSubmit={handleReviewSubmit} className="bg-[#F8F3E9] p-6 rounded-sm border border-[#C9A86A]/20 space-y-4">
                  <h4 className="font-semibold text-[#3A281C]">Share Your Experience</h4>

                  {reviewError && (
                    <div className="bg-red-50 text-red-700 px-4 py-2 text-sm rounded-sm">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-[#3A281C] mb-2">Your Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= reviewForm.rating
                                ? 'text-[#C9A86A] fill-[#C9A86A]'
                                : 'text-[#3A281C]/20 hover:text-[#C9A86A]/50'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-[#C9A86A]/30 rounded-sm bg-white focus:outline-none focus:border-[#1F4D3A]"
                  />

                  <textarea
                    placeholder="Tell us about your experience... *"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-[#C9A86A]/30 rounded-sm bg-white focus:outline-none focus:border-[#1F4D3A]"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] px-6 py-3 text-xs font-semibold uppercase tracking-widest rounded-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* ===== SUCCESS MESSAGE (NEW) ===== */}
              {submitted && (
                <div className="bg-green-50 text-green-800 px-4 py-3 text-sm rounded-sm">
                  ✅ Thank you! Your review has been submitted successfully.
                </div>
              )}

              {/* ===== REVIEWS LIST (DYNAMIC — replaces mockReviews) ===== */}
              <div id="customer-review-list" className="scroll-mt-28 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#3A281C]">Customer reviews</h3>
                  <p className="mt-0.5 text-xs text-[#3A281C]/50">Showing {visibleReviews.length} of {reviewTotal} reviews</p>
                </div>
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="review-rating-filter">Filter reviews by rating</label>
                  <select id="review-rating-filter" value={reviewRatingFilter} onChange={(event) => setReviewRatingFilter(event.target.value)} className="h-10 rounded-sm border border-[#C9A86A]/25 bg-white px-3 text-xs text-[#3A281C] focus:border-[#1F4D3A] focus:outline-none">
                    <option value="all">All ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                  </select>
                  <label className="sr-only" htmlFor="review-sort">Sort reviews</label>
                  <select id="review-sort" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)} className="h-10 rounded-sm border border-[#C9A86A]/25 bg-white px-3 text-xs text-[#3A281C] focus:border-[#1F4D3A] focus:outline-none">
                    <option value="newest">Most recent</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                  </select>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-[#1F4D3A] border-t-transparent rounded-full mx-auto" />
                  <p className="text-[#3A281C]/50 text-sm mt-3">Loading reviews...</p>
                </div>
              ) : reviewItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#3A281C]/50 text-sm">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              ) : (
                visibleReviews.length === 0 ? (
                  <p className="rounded-sm bg-[#F8F3E9] px-4 py-8 text-center text-sm text-[#3A281C]/55">No reviews match this rating. Choose another filter to see more.</p>
                ) : visibleReviews.map((review) => (
                  <div key={review._id || review.id} className="border-b border-[#C9A86A]/10 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center">
                          <span className="text-[#1F4D3A] text-xs font-semibold">
                            {(review.userId?.name || review.reviewerName || review.name || 'A').charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-[#3A281C] text-sm">
                          {review.userId?.name || review.reviewerName || review.name || 'Anonymous'}
                        </span>
                        {review.verified && (
                          <span className="text-[10px] text-[#1F4D3A] bg-[#1F4D3A]/10 px-2 py-0.5 rounded">
                            Verified Buyer
                          </span>
                        )}
                        {review.isSeeded && (
                          <span className="text-[10px] text-[#3A281C]/55 bg-[#3A281C]/5 px-2 py-0.5 rounded">
                            Demo sample
                          </span>
                        )}
                      </div>
                      <span className="text-[#3A281C]/40 text-xs">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })
                          : review.date || ''}
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
                    {review.title && (
                      <h5 className="font-semibold text-[#3A281C] text-sm mb-1">
                        {review.title}
                      </h5>
                    )}
                    <p className="text-[#3A281C]/70 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <section className="mt-12 border-t border-[#C9A86A]/10 pt-8">
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A86A]">Selected for you</p>
                <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#3A281C]">Related products</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
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
                    <div className={`aspect-[4/5] ${relGradient} flex items-center justify-center`}>
                      {p.images && p.images.length > 0 ? (
                        <img
                          // src={p.images[0].startsWith('http') ? p.images[0] : `${IMAGE_URL}${p.images[0]}`}
                          src={getProductImage(p.images[0])}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
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
                <p className="col-span-full rounded-xl border border-[#C9A86A]/10 bg-[#FBF9F4] py-10 text-center text-sm text-[#3A281C]/50">
                  More teas will be added to this collection soon.
                </p>
              )}
              </div>
          </section>
        </div>
      </div>

      {/* ============ LIGHTBOX (NEW — fullscreen image viewer) ============ */}
      <AnimatePresence>
        {isLightboxOpen && hasRealImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {activeImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={getProductImage(activeImage)}
              alt={`${product.name} full view`}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-white/5 rounded-lg backdrop-blur-sm">
                {images.map((img, idx) => (
                  <button
                    key={`lightbox-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(idx);
                    }}
                    className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-[#C9A86A] opacity-100'
                        : 'border-transparent opacity-50 hover:opacity:80'
                    }`}
                  >
                    <img
                      src={getProductImage(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
