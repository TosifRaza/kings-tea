import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Crown, LogOut, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser, logout as logoutAction } from '../../store/authSlice';
import { selectWishlistItems } from '../../store/wishlistSlice';
import { products } from '../../assets/data';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

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

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut">My Account</h1>
          <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)] mt-1">Welcome back, {user.name}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-sm border border-imperial-gold/10 overflow-hidden">
              <div className="p-4 bg-tea-green text-center">
                <div className="w-14 h-14 rounded-full bg-imperial-gold/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-warm-ivory font-[family-name:var(--font-playfair)] font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-warm-ivory font-[family-name:var(--font-playfair)] font-semibold text-sm">{user.name}</p>
                <p className="text-warm-ivory/60 text-[10px] font-[family-name:var(--font-inter)]">{user.email}</p>
              </div>
              <nav className="p-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-[family-name:var(--font-inter)] transition-colors ${
                      activeTab === item.id ? 'bg-tea-green/10 text-tea-green font-medium' : 'text-deep-walnut/60 hover:text-deep-walnut hover:bg-warm-ivory-dark'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-[family-name:var(--font-inter)] text-royal-terracotta/70 hover:text-royal-terracotta hover:bg-royal-terracotta/5 transition-colors mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-sm border border-imperial-gold/10 p-6">
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-6">Profile Information</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Name</label>
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                  </div>
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Email</label>
                    <input value={profile.email} disabled className="h-10 border border-imperial-gold/20 text-sm w-full px-3 bg-warm-ivory-dark/50 cursor-not-allowed" />
                    <p className="text-deep-walnut/30 text-[10px] font-[family-name:var(--font-inter)] mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Phone</label>
                    <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Address</label>
                    <input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="Street address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">City</label>
                      <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                    </div>
                    <div>
                      <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">State</label>
                      <input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">ZIP</label>
                      <input value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                    </div>
                    <div>
                      <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Country</label>
                      <input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                    </div>
                  </div>
                  <button className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Order History</h2>
                <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                  <Package className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
                  <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">No orders yet.</p>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">My Wishlist ({wishlistProducts.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-imperial-gold/10">
                    <Heart className="h-10 w-10 text-deep-walnut/20 mx-auto mb-3" />
                    <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="cursor-pointer group luxury-card bg-white rounded-sm overflow-hidden border border-imperial-gold/10"
                      >
                        <div className={`aspect-[4/5] bg-gradient-to-br ${p.gradient} group-hover:scale-105 transition-transform duration-700`} />
                        <div className="p-3">
                          <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-xs mb-1 group-hover:text-tea-green transition-colors">{p.name}</h3>
                          <span className="font-semibold text-deep-walnut text-sm">${p.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Saved Addresses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-sm border border-imperial-gold/10 p-5">
                    <p className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">No address saved yet. Update your profile to add an address.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="border-2 border-dashed border-imperial-gold/20 rounded-sm p-5 flex flex-col items-center justify-center text-deep-walnut/30 hover:text-deep-walnut/50 hover:border-imperial-gold/40 transition-colors"
                  >
                    <MapPin className="h-6 w-6 mb-2" />
                    <span className="text-xs font-[family-name:var(--font-inter)]">Edit Address in Profile</span>
                  </button>
                </div>
              </div>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
