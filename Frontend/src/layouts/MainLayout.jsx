import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartOpen,
  openCart,
  closeCart,
  selectCartCount,
} from '../store/cartSlice';
import { selectWishlistItems } from '../store/wishlistSlice';
import {
  selectIsAuthenticated,
  selectUser,
  logout as logoutAction,
  getMe,
} from '../store/authSlice';
import CartDrawer from '../components/cart/CartDrawer';
import AuthModal from '../components/auth/AuthModal';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Tea Culture', path: '/culture' },
  { label: 'Subscriptions', path: '/subscription' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  { icon: 'Instagram', href: '#', label: 'Instagram' },
  { icon: 'Facebook', href: '#', label: 'Facebook' },
  { icon: 'Twitter', href: '#', label: 'Twitter' },
  { icon: 'YouTube', href: '#', label: 'YouTube' },
];

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Tea Culture', path: '/culture' },
  { label: 'Subscriptions', path: '/subscription' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const customerLinks = [
  'FAQ',
  'Shipping & Delivery',
  'Returns & Exchanges',
  'Privacy Policy',
  'Terms of Service',
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector(selectWishlistItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const wishlistCount = wishlistItems.length;
  const isHome = location.pathname === '/';

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutAction());
    setUserMenuOpen(false);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-warm-ivory/95 backdrop-blur-md shadow-sm py-2'
            : isHome
            ? 'bg-transparent py-4'
            : 'bg-warm-ivory/95 backdrop-blur-md shadow-sm py-2'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/images/kings-tea-logo.png"
                alt="KING'S TEA"
                className={`transition-all duration-300 ${
                  scrolled || !isHome ? 'h-10' : 'h-12'
                }`}
              />
              <span
                className={`font-[family-name:var(--font-playfair)] font-bold tracking-wider transition-all duration-300 ${
                  scrolled || !isHome ? 'text-lg' : 'text-xl'
                } ${
                  !scrolled && isHome
                    ? 'text-white'
                    : 'text-deep-walnut'
                }`}
              >
                KING&apos;S TEA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-[family-name:var(--font-inter)] text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                    !scrolled && isHome
                      ? 'text-white/90 hover:text-white'
                      : 'text-deep-walnut/80 hover:text-deep-walnut'
                  } ${
                    location.pathname === item.path
                      ? 'text-imperial-gold'
                      : ''
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-imperial-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearch}
                    className="relative hidden sm:flex items-center"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search teas..."
                      className="h-9 pr-8 pl-3 bg-white/90 border border-imperial-gold/30 text-deep-walnut text-sm rounded-none w-full focus:outline-none focus:border-imperial-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-3.5 w-3.5 text-deep-walnut/60" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSearchOpen(true)}
                    className={`p-2 rounded-full transition-colors ${
                      !scrolled && isHome
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                    }`}
                  >
                    <Search className="h-5 w-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Wishlist */}
              <Link
                to="/shop"
                className={`p-2 rounded-full transition-colors relative ${
                  !scrolled && isHome
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                }`}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-royal-terracotta text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className={`p-2 rounded-full transition-colors relative ${
                  !scrolled && isHome
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-imperial-gold text-deep-walnut text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Auth */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-1.5 p-2 rounded-full transition-colors ${
                      !scrolled && isHome
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-tea-green flex items-center justify-center">
                      <span className="text-warm-ivory text-[10px] font-bold font-[family-name:var(--font-playfair)]">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 hidden sm:block" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-warm-ivory border border-imperial-gold/20 shadow-lg z-50"
                      >
                        <div className="p-3 border-b border-imperial-gold/10">
                          <p className="text-sm font-medium text-deep-walnut font-[family-name:var(--font-inter)]">
                            {user.name}
                          </p>
                          <p className="text-xs text-deep-walnut/50 font-[family-name:var(--font-inter)]">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-[family-name:var(--font-inter)] text-deep-walnut/70 hover:bg-warm-ivory-dark"
                          >
                            <User className="h-4 w-4" />
                            My Dashboard
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-[family-name:var(--font-inter)] text-deep-walnut/70 hover:bg-warm-ivory-dark"
                          >
                            <Settings className="h-4 w-4" />
                            Profile Settings
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-[family-name:var(--font-inter)] text-deep-walnut/70 hover:bg-warm-ivory-dark"
                            >
                              <Shield className="h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-imperial-gold/10 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-[family-name:var(--font-inter)] text-royal-terracotta hover:bg-royal-terracotta/5 w-full"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    !scrolled && isHome
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                  }`}
                >
                  <User className="h-5 w-5" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-full lg:hidden transition-colors ${
                  !scrolled && isHome
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                }`}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-warm-ivory border-t border-imperial-gold/10 overflow-hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-left px-4 py-3 rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium tracking-wide uppercase transition-colors ${
                      location.pathname === item.path
                        ? 'bg-tea-green text-warm-ivory'
                        : 'text-deep-walnut hover:bg-warm-ivory-dark'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-imperial-gold/10">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-3 bg-tea-green/5 rounded-lg">
                        <p className="text-deep-walnut font-[family-name:var(--font-inter)] text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-deep-walnut/50 font-[family-name:var(--font-inter)] text-xs">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full px-4 py-2 border border-imperial-gold/20 text-deep-walnut text-xs uppercase tracking-wider text-center"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="w-full px-4 py-2 border border-royal-terracotta/20 text-royal-terracotta text-xs uppercase tracking-wider"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-tea-green hover:bg-tea-green-light text-warm-ivory px-4 py-2 text-xs uppercase tracking-wider"
                    >
                      Sign In / Register
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const SocialIcon = ({ name, className }) => {
    const icons = {
      Instagram: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      Facebook: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      Twitter: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      YouTube: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
    };
    return icons[name] || null;
  };

  return (
    <footer className="bg-deep-walnut text-warm-ivory/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/kings-tea-logo.png"
                alt="KING'S TEA"
                className="h-10 brightness-0 invert"
              />
              <span className="font-[family-name:var(--font-playfair)] font-bold text-lg text-warm-ivory">
                KING&apos;S TEA
              </span>
            </div>
            <p className="text-warm-ivory/60 text-sm leading-relaxed mb-6">
              Experience centuries of tea heritage in every cup. Premium luxury
              teas sourced from the world&apos;s finest gardens, crafted for
              connoisseurs.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-warm-ivory/20 flex items-center justify-center text-warm-ivory/60 hover:border-imperial-gold hover:text-imperial-gold transition-colors"
                >
                  <SocialIcon name={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-warm-ivory mb-4 text-base">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-warm-ivory/60 hover:text-imperial-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-warm-ivory mb-4 text-base">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {customerLinks.map((link) => (
                <li key={link}>
                  <button className="text-warm-ivory/60 hover:text-imperial-gold transition-colors text-sm">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-warm-ivory mb-4 text-base">
              Stay Connected
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>concierge@kingstea.com</span>
              </div>
              <div className="flex items-center gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>+1 (888) 546-7890</span>
              </div>
              <div className="flex items-start gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>12 Heritage Lane, Mayfair, London W1K 3QP</span>
              </div>
            </div>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full bg-warm-ivory/10 border border-warm-ivory/20 text-warm-ivory placeholder:text-warm-ivory/40 text-sm px-3 focus:outline-none focus:border-imperial-gold"
              />
              <button
                type="submit"
                className="w-full h-9 bg-imperial-gold hover:bg-imperial-gold-light text-deep-walnut text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-warm-ivory/40 text-xs">
            &copy; {new Date().getFullYear()} KING&apos;S TEA. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-warm-ivory/40 text-xs">
              Accepted Payments:
            </span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((p) => (
                <span
                  key={p}
                  className="text-[10px] px-1.5 py-0.5 border border-warm-ivory/20 rounded text-warm-ivory/50"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
