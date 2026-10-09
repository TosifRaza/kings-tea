// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { User, Package, Heart, MapPin, Crown, LogOut, Loader2 } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { selectIsAuthenticated, selectUser, logout as logoutAction } from '../../store/authSlice';
// import { selectWishlistItems } from '../../store/wishlistSlice';
// import { fetchMyOrders, selectOrders, selectOrdersLoading } from '../../store/orderSlice';
// import { products } from '../../assets/data';

// export default function UserDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectUser);
//   const wishlistItems = useSelector(selectWishlistItems);
//   const orders = useSelector(selectOrders);
//   const ordersLoading = useSelector(selectOrdersLoading);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [profile, setProfile] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setProfile((prev) => ({
//         ...prev,
//         name: user.name || '',
//         email: user.email || '',
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'orders') {
//       dispatch(fetchMyOrders());
//     }
//   }, [activeTab, dispatch]);

//   if (!isAuthenticated || !user) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center">
//         <User className="h-16 w-16 text-deep-walnut/20 mb-4" />
//         <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut mb-2">Sign In Required</h2>
//         <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)] mb-6">Please sign in to access your dashboard.</p>
//         <button
//           onClick={() => navigate('/')}
//           className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors"
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

//   const sidebarItems = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'orders', label: 'Orders', icon: Package },
//     { id: 'wishlist', label: 'Wishlist', icon: Heart },
//     { id: 'addresses', label: 'Addresses', icon: MapPin },
//     { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
//   ];

//   const handleLogout = async () => {
//     await dispatch(logoutAction());
//     navigate('/');
//   };

//   const statusColors = {
//     pending: 'bg-imperial-gold/10 text-imperial-gold',
//     processing: 'bg-blue-50 text-blue-600',
//     shipped: 'bg-purple-50 text-purple-600',
//     delivered: 'bg-emerald-50 text-emerald-600',
//     cancelled: 'bg-red-50 text-red-600',
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-24 pb-16 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut">My Account</h1>
//           <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)] mt-1">Welcome back, {user.name}</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-56 flex-shrink-0">
//             <div className="bg-white rounded-sm border border-imperial-gold/10 overflow-hidden">
//               <div className="p-4 bg-tea-green text-center">
//                 <div className="w-14 h-14 rounded-full bg-imperial-gold/20 flex items-center justify-center mx-auto mb-2">
//                   <span className="text-warm-ivory font-[family-name:var(--font-playfair)] font-bold text-lg">
//                     {user.name?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <p className="text-warm-ivory font-[family-name:var(--font-playfair)] font-semibold text-sm">{user.name}</p>
//                 <p className="text-warm-ivory/60 text-[10px] font-[family-name:var(--font-inter)]">{user.email}</p>
//               </div>
//               <nav className="p-2">
//                 {sidebarItems.map((item) => (
//                   <button
//                     key={item.id}
//                     onClick={() => setActiveTab(item.id)}
//                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-[family-name:var(--font-inter)] transition-colors ${
//                       activeTab === item.id ? 'bg-tea-green/10 text-tea-green font-medium' : 'text-deep-walnut/60 hover:text-deep-walnut hover:bg-warm-ivory-dark'
//                     }`}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.label}
//                   </button>
//                 ))}
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-[family-name:var(--font-inter)] text-royal-terracotta/70 hover:text-royal-terracotta hover:bg-royal-terracotta/5 transition-colors mt-2"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Sign Out
//                 </button>
//               </nav>
//             </div>
//           </div>

//           <div className="flex-1">
//             {activeTab === 'profile' && (
//               <div className="bg-white rounded-sm border border-imperial-gold/10 p-6">
//                 <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-6">Profile Information</h2>
//                 <div className="space-y-4 max-w-md">
//                   <div>
//                     <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Name</label>
//                     <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
//                   </div>
//                   <div>
//                     <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Email</label>
//                     <input value={profile.email} disabled className="h-10 border border-imperial-gold/20 text-sm w-full px-3 bg-warm-ivory-dark/50 cursor-not-allowed" />
//                     <p className="text-deep-walnut/30 text-[10px] font-[family-name:var(--font-inter)] mt-1">Email cannot be changed</p>
//                   </div>
//                   <div>
//                     <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Phone</label>
//                     <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="+1 (555) 000-0000" />
//                   </div>
//                   <div>
//                     <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Address</label>
//                     <input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="Street address" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">City</label>
//                       <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
//                     </div>
//                     <div>
//                       <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">State</label>
//                       <input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">ZIP</label>
//                       <input value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
//                     </div>
//                     <div>
//                       <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Country</label>
//                       <input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
//                     </div>
//                   </div>
//                   <button className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors">
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'orders' && (
//               <div className="space-y-4">
//                 <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Order History</h2>

//                 {ordersLoading ? (
//                   <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
//                     <Loader2 className="h-8 w-8 text-tea-green mx-auto mb-3 animate-spin" />
//                     <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Loading orders...</p>
//                   </div>
//                 ) : orders.length === 0 ? (
//                   <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
//                     <Package className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
//                     <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">No orders yet.</p>
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)]">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
//                     {orders.map((order) => (
//                       <div key={order._id} className="bg-white rounded-sm border border-imperial-gold/10 overflow-hidden">
//                         <div className="flex items-center justify-between px-5 py-3 bg-warm-ivory-dark/30 border-b border-imperial-gold/5">
//                           <div className="flex items-center gap-4">
//                             <div>
//                               <p className="text-[10px] text-deep-walnut/40 uppercase tracking-wider font-[family-name:var(--font-inter)]">Order</p>
//                               <p className="text-xs font-semibold text-deep-walnut font-[family-name:var(--font-inter)]">
//                                 #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-[10px] text-deep-walnut/40 uppercase tracking-wider font-[family-name:var(--font-inter)]">Date</p>
//                               <p className="text-xs text-deep-walnut font-[family-name:var(--font-inter)]">
//                                 {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                               </p>
//                             </div>
//                           </div>
//                           <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || statusColors.pending} font-[family-name:var(--font-inter)] capitalize`}>
//                             {order.status}
//                           </span>
//                         </div>
//                         <div className="px-5 py-3 space-y-2">
//                           {order.items?.map((item, idx) => (
//                             <div key={idx} className="flex items-center justify-between">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded bg-tea-green/5 flex items-center justify-center">
//                                   <Package className="h-3.5 w-3.5 text-tea-green/40" />
//                                 </div>
//                                 <div>
//                                   <p className="text-xs font-medium text-deep-walnut font-[family-name:var(--font-inter)]">{item.name}</p>
//                                   <p className="text-[10px] text-deep-walnut/40 font-[family-name:var(--font-inter)]">Qty: {item.quantity}</p>
//                                 </div>
//                               </div>
//                               <p className="text-xs font-semibold text-deep-walnut font-[family-name:var(--font-inter)]">
//                                 Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                         <div className="flex items-center justify-between px-5 py-3 border-t border-imperial-gold/5 bg-warm-ivory-dark/20">
//                           <p className="text-[10px] text-deep-walnut/40 font-[family-name:var(--font-inter)]">
//                             {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
//                             {order.shippingCity && <> · {order.shippingCity}, {order.shippingState}</>}
//                           </p>
//                           <p className="text-sm font-bold text-tea-green font-[family-name:var(--font-inter)]">
//                             Total: Rs. {Number(order.total).toLocaleString('en-IN')}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             )}

//             {activeTab === 'wishlist' && (
//               <div>
//                 <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">My Wishlist ({wishlistProducts.length})</h2>
//                 {wishlistProducts.length === 0 ? (
//                   <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
//                     <Heart className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
//                     <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Your wishlist is empty.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {wishlistProducts.map((p) => (
//                       <div
//                         key={p.id}
//                         onClick={() => navigate(`/product/${p.slug}`)}
//                         className="cursor-pointer group luxury-card bg-white rounded-sm overflow-hidden border border-imperial-gold/10"
//                       >
//                         <div className={`aspect-[4/5] bg-gradient-to-br ${p.gradient} group-hover:scale-105 transition-transform duration-700`} />
//                         <div className="p-3">
//                           <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-xs mb-1 group-hover:text-tea-green transition-colors">{p.name}</h3>
//                           <span className="font-semibold text-deep-walnut text-sm">${p.price}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'addresses' && (
//               <div>
//                 <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Saved Addresses</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="bg-white rounded-sm border border-imperial-gold/10 p-5">
//                     <p className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">No address saved yet. Update your profile to add an address.</p>
//                   </div>
//                   <button
//                     onClick={() => setActiveTab('profile')}
//                     className="border-2 border-dashed border-imperial-gold/20 rounded-sm p-5 flex flex-col items-center justify-center text-deep-walnut/30 hover:text-deep-walnut/50 hover:border-imperial-gold/40 transition-colors"
//                   >
//                     <MapPin className="h-6 w-6 mb-2" />
//                     <span className="text-xs font-[family-name:var(--font-inter)]">Edit Address in Profile</span>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'subscriptions' && (
//               <div>
//                 <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">My Subscriptions</h2>
//                 <div className="bg-white rounded-sm border border-imperial-gold/10 p-5">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Crown className="h-5 w-5 text-imperial-gold" />
//                     <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut">No Active Subscription</h3>
//                   </div>
//                   <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mb-4">Subscribe to our tea box and receive curated selections delivered to your door.</p>
//                   <button
//                     onClick={() => navigate('/subscription')}
//                     className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-4 py-2 transition-colors"
//                   >
//                     View Plans
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Crown,
  Heart,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectIsAuthenticated, selectUser, setUser, logout as logoutAction } from '../../store/authSlice';
import { selectWishlistItems } from '../../store/wishlistSlice';
import { fetchMyOrders, selectOrders, selectOrdersLoading } from '../../store/orderSlice';
import { productAPI, userAPI } from '../../services/api';
import { getProductImage } from '../../utils/image';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
    country: user?.country || '',
  });

  // Auto-open tab from URL query (?tab=wishlist) — used by the heart icon in MainLayout
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'wishlist', 'addresses', 'subscriptions'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, dispatch]);

  // Fetch REAL product data from backend for wishlisted items
  // useEffect(() => {
  //   if (wishlistItems.length === 0) {
  //     setWishlistProducts([]);
  //     return;
  //   }
  //   let cancelled = false;
  //   setWishlistLoading(true);
  //   Promise.all(
  //     wishlistItems.map((id) =>
  //       productAPI
  //         .getProductById(id)
  //         .then((res) => res.data?.data || res.data)
  //         .catch(() => null)
  //     )
  //   ).then((products) => {
  //     if (!cancelled) {
  //       setWishlistProducts(products.filter(Boolean));
  //       setWishlistLoading(false);
  //     }
  //   });
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [wishlistItems]);


    // Fetch REAL product data from backend for wishlisted items
  useEffect(() => {
    if (wishlistItems.length === 0) {
      setWishlistProducts([]);
      return;
    }
    let cancelled = false;
    setWishlistLoading(true);
    Promise.all(
      wishlistItems.map((id) =>
        productAPI
          .getProductById(id)
          .then((res) => {
            const d = res.data;
            // Handle all common API response shapes:
            // 1. { data: product }              → use d.data
            // 2. { success, product }           → use d.product
            // 3. { success, data: product }     → use d.data
            // 4. product directly               → use d
            if (d?.data?.product && (d.data.product._id || d.data.product.id)) return d.data.product;
            if (d?.data && (d.data._id || d.data.id || d.data.slug)) return d.data;
            if (d?.product && (d.product._id || d.product.id)) return d.product;
            if (d?._id || d?.id || d?.slug) return d;
            console.warn('Wishlist product unexpected response shape for id:', id, d);
            return null;
          })
          .catch((err) => {
            console.error('Failed to fetch wishlist product:', id, err);
            return null;
          })
      )
    ).then((products) => {
      if (!cancelled) {
        setWishlistProducts(products.filter(Boolean));
        setWishlistLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [wishlistItems]);
  if (!isAuthenticated || !user) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center">
        <User className="h-16 w-16 text-deep-walnut/20 mb-4" />
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut mb-2">Sign In Required</h2>
        <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)] mb-6">Please sign in to access your dashboard.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
  ];

  const handleLogout = async () => {
    await dispatch(logoutAction());
    navigate('/');
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileNotice('');
    setProfileError('');

    try {
      const response = await userAPI.updateProfile(user._id, {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
        city: profile.city.trim(),
        state: profile.state.trim(),
        zip: profile.zip.trim(),
        country: profile.country.trim(),
      });
      const updatedUser = response.data?.data?.user || response.data?.data;
      if (!updatedUser) throw new Error('Profile could not be saved. Please try again.');

      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile((current) => ({ ...current, ...updatedUser }));
      setProfileNotice('Your profile has been updated.');
    } catch (error) {
      setProfileError(error.response?.data?.message || error.message || 'Could not save your profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const statusColors = {
    pending: 'bg-imperial-gold/10 text-imperial-gold',
    processing: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-emerald-50 text-emerald-600',
    cancelled: 'bg-red-50 text-red-600',
  };

  const inputClassName = 'mt-2 h-12 w-full rounded-xl border border-deep-walnut/10 bg-[#FCFBF8] px-4 text-sm text-deep-walnut outline-none transition placeholder:text-deep-walnut/30 focus:border-tea-green/50 focus:bg-white focus:ring-4 focus:ring-tea-green/5 disabled:cursor-not-allowed disabled:bg-warm-ivory-dark/40';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen bg-[#F6F4EE] pb-16 pt-24 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-imperial-gold/20 pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-tea-green/70">
              <Sparkles className="h-3.5 w-3.5" />
              King’s Tea account
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-tight text-deep-walnut sm:text-4xl">
              Welcome back, {user.name?.split(' ')[0] || 'tea lover'}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-deep-walnut/55">
              Your orders, saved teas, and account details in one place.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-tea-green/10 bg-white/80 px-4 py-2 text-xs text-tea-green/80 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Your account is private
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-imperial-gold/15 bg-white shadow-[0_12px_40px_rgba(58,40,28,0.05)]">
              <div className="relative overflow-hidden bg-tea-green px-5 pb-5 pt-6 text-center">
                <div className="pointer-events-none absolute -right-9 -top-12 h-36 w-36 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-2 -top-5 h-24 w-24 rounded-full border border-imperial-gold/20" />
                <div className="relative mx-auto mb-3 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-imperial-gold/50 bg-white/10 text-2xl font-semibold text-warm-ivory shadow-inner">
                  {user.name?.trim()?.charAt(0).toUpperCase() || <User className="h-7 w-7" />}
                </div>
                <p className="relative font-[family-name:var(--font-playfair)] text-lg font-semibold text-white">{user.name}</p>
                <div className="relative mt-1 flex items-center justify-center gap-1.5 text-xs text-white/65">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="max-w-full truncate">{user.email}</span>
                </div>
                <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-white/85">
                  <BadgeCheck className="h-3.5 w-3.5 text-imperial-gold-light" />
                  Member account
                </div>
              </div>

              <nav aria-label="Account sections" className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1">
                {sidebarItems.map((item) => {
                  const ItemIcon = item.icon;
                  const count = item.id === 'orders' ? orders.length : item.id === 'wishlist' ? wishlistItems.length : null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex min-w-fit items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition-all lg:w-full ${
                        activeTab === item.id
                          ? 'bg-[#EAF1ED] font-medium text-tea-green shadow-sm'
                          : 'text-deep-walnut/55 hover:bg-warm-ivory-dark/60 hover:text-deep-walnut'
                      }`}
                    >
                      <ItemIcon className={`h-[18px] w-[18px] ${activeTab === item.id ? 'text-tea-green' : 'text-deep-walnut/35 group-hover:text-deep-walnut/60'}`} />
                      <span>{item.label}</span>
                      {count !== null && count > 0 && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] text-deep-walnut/60">{count}</span>}
                      <ChevronRight className={`ml-auto hidden h-4 w-4 lg:block ${activeTab === item.id ? 'text-tea-green/50' : 'text-transparent'}`} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-w-fit items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm text-royal-terracotta/75 transition-colors hover:bg-royal-terracotta/5 hover:text-royal-terracotta lg:mt-2 lg:w-full"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Sign out
                </button>
              </nav>
            </div>

            <div className="hidden rounded-2xl border border-imperial-gold/15 bg-[#FBF9F4] p-5 lg:block">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-imperial-gold/15 text-imperial-gold-dark">
                <Crown className="h-4 w-4" />
              </div>
              <p className="font-[family-name:var(--font-playfair)] text-base font-semibold text-deep-walnut">Make room for a new ritual.</p>
              <p className="mt-1.5 text-xs leading-5 text-deep-walnut/55">Explore small-batch teas selected for slower, better moments.</p>
              <button type="button" onClick={() => navigate('/shop')} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-tea-green hover:text-tea-green-light">
                Explore the collection <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>

          <main className="min-w-0">
            {activeTab === 'profile' && (
              <div className="overflow-hidden rounded-2xl border border-imperial-gold/15 bg-white shadow-[0_12px_40px_rgba(58,40,28,0.05)]">
                <div className="border-b border-deep-walnut/5 px-5 py-6 sm:px-8 sm:py-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-imperial-gold-dark">Account settings</p>
                      <h2 className="mt-1.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-deep-walnut">Profile details</h2>
                      <p className="mt-1.5 text-sm text-deep-walnut/50">Keep your contact and delivery information up to date.</p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F3F6F3] px-3 py-2 text-[11px] text-tea-green/80">
                      <ShieldCheck className="h-4 w-4" /> Private to your account
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="px-5 py-6 sm:px-8 sm:py-8">
                  <section>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1ED] text-tea-green"><User className="h-4 w-4" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-deep-walnut">Personal information</h3>
                        <p className="mt-0.5 text-xs text-deep-walnut/45">The details used to identify your account.</p>
                      </div>
                    </div>
                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-name">
                        Full name
                        <input id="profile-name" name="name" autoComplete="name" required minLength={2} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClassName} placeholder="Your name" />
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-email">
                        Email address
                        <input id="profile-email" type="email" value={profile.email} disabled className={inputClassName} />
                        <span className="mt-1.5 block text-[11px] font-normal text-deep-walnut/40">Email is linked to your sign-in.</span>
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70 sm:col-span-2" htmlFor="profile-phone">
                        Phone number <span className="font-normal text-deep-walnut/40">(optional)</span>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-walnut/30" />
                          <input id="profile-phone" name="tel" autoComplete="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={`${inputClassName} pl-11`} placeholder="Add a phone number" />
                        </div>
                      </label>
                    </div>
                  </section>

                  <div className="my-7 border-t border-deep-walnut/5 sm:my-8" />

                  <section>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F1E4] text-imperial-gold-dark"><MapPin className="h-4 w-4" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-deep-walnut">Delivery address</h3>
                        <p className="mt-0.5 text-xs text-deep-walnut/45">Used to make checkout quicker next time.</p>
                      </div>
                    </div>
                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      <label className="block text-xs font-medium text-deep-walnut/70 sm:col-span-2" htmlFor="profile-address">
                        Street address
                        <input id="profile-address" name="street-address" autoComplete="street-address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={inputClassName} placeholder="House number and street" />
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-city">
                        City
                        <input id="profile-city" name="address-level2" autoComplete="address-level2" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className={inputClassName} placeholder="City" />
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-state">
                        State / region
                        <input id="profile-state" name="address-level1" autoComplete="address-level1" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className={inputClassName} placeholder="State or region" />
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-zip">
                        Postal code
                        <input id="profile-zip" name="postal-code" autoComplete="postal-code" value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} className={inputClassName} placeholder="Postal code" />
                      </label>
                      <label className="block text-xs font-medium text-deep-walnut/70" htmlFor="profile-country">
                        Country
                        <input id="profile-country" name="country-name" autoComplete="country-name" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputClassName} placeholder="Country" />
                      </label>
                    </div>
                  </section>

                  {profileNotice && <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check className="h-4 w-4" />{profileNotice}</div>}
                  {profileError && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>}

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-deep-walnut/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-deep-walnut/40">Your information is only used to manage your account and orders.</p>
                    <button type="submit" disabled={savingProfile || profile.name.trim().length < 2} className="inline-flex items-center justify-center gap-2 rounded-xl bg-tea-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(31,77,58,0.16)] transition hover:bg-tea-green-light disabled:cursor-not-allowed disabled:opacity-60">
                      {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {savingProfile ? 'Saving profile…' : 'Save profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Order History</h2>

                {ordersLoading ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                    <Loader2 className="h-8 w-8 text-tea-green mx-auto mb-3 animate-spin" />
                    <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                    <Package className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
                    <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">No orders yet.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)]">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-sm border border-imperial-gold/10 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-warm-ivory-dark/30 border-b border-imperial-gold/5">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-[10px] text-deep-walnut/40 uppercase tracking-wider font-[family-name:var(--font-inter)]">Order</p>
                              <p className="text-xs font-semibold text-deep-walnut font-[family-name:var(--font-inter)]">
                                #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-deep-walnut/40 uppercase tracking-wider font-[family-name:var(--font-inter)]">Date</p>
                              <p className="text-xs text-deep-walnut font-[family-name:var(--font-inter)]">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || statusColors.pending} font-[family-name:var(--font-inter)] capitalize`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="px-5 py-3 space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-tea-green/5 flex items-center justify-center">
                                  <Package className="h-3.5 w-3.5 text-tea-green/40" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-deep-walnut font-[family-name:var(--font-inter)]">{item.name}</p>
                                  <p className="text-[10px] text-deep-walnut/40 font-[family-name:var(--font-inter)]">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-deep-walnut font-[family-name:var(--font-inter)]">
                                Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between px-5 py-3 border-t border-imperial-gold/5 bg-warm-ivory-dark/20">
                          <p className="text-[10px] text-deep-walnut/40 font-[family-name:var(--font-inter)]">
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                            {order.shippingCity && <> · {order.shippingCity}, {order.shippingState}</>}
                          </p>
                          <p className="text-sm font-bold text-tea-green font-[family-name:var(--font-inter)]">
                            Total: Rs. {Number(order.total).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">My Wishlist ({wishlistItems.length})</h2>
                {wishlistLoading ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                    <Loader2 className="h-8 w-8 text-tea-green mx-auto mb-3 animate-spin" />
                    <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Loading wishlist...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                    <Heart className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
                    <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Your wishlist is empty.</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="mt-4 bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors"
                    >
                      Browse Teas
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => {
                      const img = getProductImage(p.images?.[0] || p.image);
                      return (
                        <div
                          key={p._id || p.id}
                          // onClick={() => navigate(`/product/${p.slug}`)}
                          onClick={() => navigate(`/product/${p.slug || p._id || p.id}`)}
                          className="cursor-pointer group luxury-card bg-white rounded-sm overflow-hidden border border-imperial-gold/10"
                        >
                          <div className="aspect-[4/5] overflow-hidden bg-warm-ivory-dark/30">
                            {img ? (
                              <img
                                src={img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-deep-walnut/20" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-xs mb-1 group-hover:text-tea-green transition-colors line-clamp-1">{p.name}</h3>
                            <span className="font-semibold text-deep-walnut text-sm">Rs. {Number(p.price).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <section className="overflow-hidden rounded-2xl border border-imperial-gold/15 bg-white shadow-[0_12px_40px_rgba(58,40,28,0.05)]">
                <div className="flex flex-col gap-3 border-b border-deep-walnut/5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-imperial-gold-dark">Delivery preferences</p>
                    <h2 className="mt-1.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-deep-walnut">Saved address</h2>
                    <p className="mt-1.5 text-sm text-deep-walnut/50">Your address is ready for a quicker checkout.</p>
                  </div>
                  <button type="button" onClick={() => setActiveTab('profile')} className="inline-flex w-fit items-center gap-2 rounded-xl border border-tea-green/15 px-4 py-2.5 text-xs font-semibold text-tea-green transition hover:bg-[#EAF1ED]">
                    Edit address <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {profile.address || profile.city || profile.state || profile.zip || profile.country ? (
                  <div className="p-5 sm:p-7">
                    <div className="relative overflow-hidden rounded-2xl border border-imperial-gold/15 bg-[#FBF9F4] p-5 sm:p-6">
                      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full border border-imperial-gold/15" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tea-green text-white"><MapPin className="h-5 w-5" /></div>
                        <div className="min-w-0">
                          <p className="font-semibold text-deep-walnut">{profile.name || 'Delivery address'}</p>
                          <div className="mt-2 space-y-1 text-sm leading-6 text-deep-walnut/65">
                            {profile.address && <p>{profile.address}</p>}
                            {(profile.city || profile.state || profile.zip) && <p>{[profile.city, profile.state, profile.zip].filter(Boolean).join(', ')}</p>}
                            {profile.country && <p>{profile.country}</p>}
                          </div>
                          {profile.phone && <p className="mt-3 flex items-center gap-2 text-xs text-deep-walnut/55"><Phone className="h-3.5 w-3.5" />{profile.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center sm:px-7">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F1E4] text-imperial-gold-dark"><MapPin className="h-6 w-6" /></div>
                    <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-lg font-semibold text-deep-walnut">No address saved yet</h3>
                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-deep-walnut/50">Add your delivery details to make your next tea order quicker.</p>
                    <button type="button" onClick={() => setActiveTab('profile')} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-tea-green px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-tea-green-light">
                      Add an address <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'subscriptions' && (
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">My Subscriptions</h2>
                <div className="bg-white rounded-sm border border-imperial-gold/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="h-5 w-5 text-imperial-gold" />
                    <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut">No Active Subscription</h3>
                  </div>
                  <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mb-4">Subscribe to our tea box and receive curated selections delivered to your door.</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-4 py-2 transition-colors"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
}
