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
import { selectWishlistItems ,loadWishlist} from '../store/wishlistSlice';
import {
  selectIsAuthenticated,
  selectUser,
  logout as logoutAction,
  getMe,
} from '../store/authSlice';
import CartDrawer from '../components/cart/CartDrawer';
import CartNotification from '../components/cart/CartNotification';
import AuthModal from '../components/auth/AuthModal';
import { siteContentAPI } from '../services/api';
import { newsletterAPI } from '../services/api';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Tea Culture', path: '/culture' },
  { label: 'Subscriptions', path: '/subscription' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  // Published social links are loaded from the footer content record.
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

const mobileExploreLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Tea Culture', path: '/culture' },
  { label: 'About', path: '/about' },
];

const mobileCustomerLinks = ['Contact Us', 'Shipping & Returns', 'FAQs', 'Track Order'];

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
  const [announcement, setAnnouncement] = useState(null);
  const [configuredNav, setConfiguredNav] = useState(null);

  const wishlistCount = wishlistItems.length;
  const isHome = location.pathname === '/';
  const isAccountDashboard = location.pathname === '/dashboard';
  const isShop = location.pathname.startsWith('/shop');
  const visibleNavItems = configuredNav?.length ? configuredNav : navItems;

  useEffect(() => {
    let alive = true;
    siteContentAPI.getContent('navigation').then(({ data }) => {
      const links = data?.data?.links;
      if (alive && Array.isArray(links)) setConfiguredNav(links.filter((link) => link.enabled !== false && typeof link.label === 'string' && typeof link.href === 'string' && link.href.startsWith('/')).map((link) => ({ label: link.label, path: link.href })));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // useEffect(() => {
  //   dispatch(getMe());
  // }, [dispatch]);
  useEffect(() => {
  dispatch(getMe());
  dispatch(loadWishlist());
}, [dispatch]);

  useEffect(() => {
    let active = true;
    siteContentAPI.getHomepage().then(({ data }) => {
      if (!active) return;
      const item = data?.data?.announcement;
      const now = Date.now();
      if (item?.enabled && item.text && (!item.startAt || new Date(item.startAt).getTime() <= now) && (!item.endAt || new Date(item.endAt).getTime() >= now)) setAnnouncement(item);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

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
      {announcement && <div className="fixed inset-x-0 top-0 z-[60] flex min-h-8 items-center justify-center px-3 py-1 text-center text-xs font-medium" style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(announcement.backgroundColor || '') ? announcement.backgroundColor : '#173e30', color: /^#[0-9a-f]{6}$/i.test(announcement.textColor || '') ? announcement.textColor : '#fff' }}>
        {announcement.href && /^\/(?!\/)|^https:\/\//.test(announcement.href)
          ? <a href={announcement.href} className="underline underline-offset-2">{announcement.text}</a>
          : <span>{announcement.text}</span>}
      </div>}
      <motion.header
        className={`fixed ${announcement ? 'top-8' : 'top-0'} left-0 right-0 z-50 transition-all duration-500 ${
          isShop
            ? 'bg-[#faf8ef]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(45,54,38,0.08)] py-1 sm:py-1.5'
            : isAccountDashboard
            ? 'bg-tea-green shadow-md py-2'
            : scrolled
            ? 'bg-warm-ivory/95 backdrop-blur-md shadow-sm py-2'
            : isHome
            ? 'bg-transparent py-4'
            : 'bg-warm-ivory/95 backdrop-blur-md shadow-sm py-2'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 group">
              <img
                src="/images/kings-tea-logo.png"
                alt="KING'S TEA"
                className={`transition-all duration-300 ${isShop ? 'h-9 w-9 rounded-md object-cover sm:h-10 sm:w-auto sm:rounded-none' : scrolled || !isHome ? 'h-9 sm:h-10' : 'h-10 sm:h-12'}`}
              />
              <span
                className={`hidden flex-col font-[family-name:var(--font-playfair)] font-bold tracking-wider transition-all duration-300 sm:flex ${
                  isAccountDashboard ? 'text-base text-warm-ivory' : scrolled || !isHome ? 'text-lg text-deep-walnut' : 'text-xl text-white'
                } whitespace-nowrap`}
              >
                KING&apos;S TEA
                {isAccountDashboard && <span className="mt-0.5 font-[family-name:var(--font-inter)] text-[9px] font-normal tracking-normal text-warm-ivory/70">Your tea ritual, delivered</span>}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-[family-name:var(--font-inter)] text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                    isAccountDashboard || (!scrolled && isHome)
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
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
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
                    className={`rounded-full p-2 transition-colors ${
                      isAccountDashboard || (!scrolled && isHome)
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
                to="/dashboard?tab=wishlist"
                className={`relative rounded-full p-2 transition-colors ${
                  isAccountDashboard || (!scrolled && isHome)
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
                className={`relative rounded-full p-2 transition-colors ${
                  isAccountDashboard || (!scrolled && isHome)
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
                    className={`flex items-center gap-1.5 rounded-full p-1.5 sm:p-2 transition-colors ${
                      isAccountDashboard || (!scrolled && isHome)
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-deep-walnut/70 hover:text-deep-walnut hover:bg-deep-walnut/5'
                    }`}
                  >
                    <div className={`${isShop ? 'h-8 w-8' : 'h-7 w-7'} rounded-full flex items-center justify-center ${isAccountDashboard ? 'border border-white/50 bg-white/10' : 'bg-tea-green'}`}>
                      <span className="text-warm-ivory text-xs font-bold font-[family-name:var(--font-playfair)]">
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
                  className={`rounded-full p-1.5 sm:p-2 transition-colors ${
                    isAccountDashboard || (!scrolled && isHome)
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
                  isAccountDashboard || (!scrolled && isHome)
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
                {visibleNavItems.map((item) => (
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
      <CartNotification />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [unsubscribeToken, setUnsubscribeToken] = useState('');
  const [footerContent, setFooterContent] = useState(null);
  useEffect(() => {
    let alive = true;
    siteContentAPI.getContent('footer').then(({ data }) => { if (alive) setFooterContent(data?.data || null); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const configuredExplore = footerContent?.columns?.find((column) => column.key === 'explore')?.links;
  const configuredCare = footerContent?.columns?.find((column) => column.key === 'customer-care')?.links;
  const exploreLinks = Array.isArray(configuredExplore) ? configuredExplore.filter((link) => link.enabled !== false && link.label && typeof link.href === 'string' && link.href.startsWith('/')).map((link) => ({ label: link.label, path: link.href })) : mobileExploreLinks;
  const careLinks = Array.isArray(configuredCare) ? configuredCare.filter((link) => link.enabled !== false && link.label && typeof link.href === 'string' && link.href.startsWith('/')).map((link) => ({ label: link.label, path: link.href })) : mobileCustomerLinks.map((label) => ({ label, path: label === 'Contact Us' ? '/contact' : label === 'FAQs' ? '/faq' : label === 'Track Order' ? '/dashboard?tab=orders' : '/policies/shipping-returns' }));
  const desktopCareLinks = Array.isArray(configuredCare) ? careLinks : customerLinks.map((label) => ({ label, path: label === 'FAQ' ? '/faq' : label === 'Privacy Policy' ? '/policies/privacy-policy' : label === 'Terms of Service' ? '/policies/terms' : label === 'Shipping & Delivery' ? '/policies/shipping' : label === 'Returns & Exchanges' ? '/policies/returns' : '/contact' }));

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterError('');
    try {
      const { data } = await newsletterAPI.subscribe({ email: email.trim(), consent });
      setSubscribed(true);
      setUnsubscribeToken(data?.data?.unsubscribeToken || '');
      setEmail('');
      setConsent(false);
    } catch (error) { setNewsletterError(error.response?.data?.message || 'Could not subscribe. Please try again.'); }
  };

  const handleUnsubscribe = async () => {
    try {
      await newsletterAPI.unsubscribe({ token: unsubscribeToken });
      setSubscribed(false); setUnsubscribeToken(''); setConsent(false);
    } catch (error) { setNewsletterError(error.response?.data?.message || 'Could not unsubscribe with this link.'); }
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
          <path d="M4 4l16 16M20 4L4 20" />
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
      <div className="max-w-7xl mx-auto px-5 py-5 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 border-b border-imperial-gold/55 pb-3 sm:col-span-1 sm:border-0 sm:pb-0 lg:col-span-1">
            <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-2">
              <img
                src="/images/kings-tea-logo.png"
                alt="KING'S TEA"
                className="h-14 w-14 rounded-sm border border-imperial-gold/80 p-1 object-cover sm:h-10 sm:w-auto sm:border-0 sm:p-0 sm:brightness-0 sm:invert"
              />
              <div>
                <span className="block font-[family-name:var(--font-playfair)] text-[22px] font-bold leading-tight text-warm-ivory sm:text-lg">
                  KING&apos;S TEA
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-cormorant)] text-[15px] leading-tight text-warm-ivory/85 sm:hidden">
                  Royal taste. Timeless tradition.
                </span>
              </div>
            </div>
            <p className="mb-3 font-[family-name:var(--font-cormorant)] text-sm leading-[1.35] text-warm-ivory/85 sm:mb-4 sm:font-[family-name:var(--font-inter)] sm:text-sm sm:leading-relaxed sm:text-warm-ivory/60">
              Discover tea varieties, brewing inspiration, and product details from King&apos;s Tea.
            </p>
            <div className="flex gap-3 sm:gap-3">
              {(Array.isArray(footerContent?.socials) ? footerContent.socials.filter((social) => social.enabled !== false && /^https:\/\//i.test(social.href || '')).map((social) => ({ icon: social.icon, href: social.href, label: social.label })) : socialLinks).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-imperial-gold/70 text-imperial-gold transition-colors hover:border-imperial-gold hover:bg-imperial-gold/10 sm:h-9 sm:w-9 sm:border-warm-ivory/20 sm:text-warm-ivory/60"
                >
                  <SocialIcon name={social.icon} className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b border-imperial-gold/55 pb-3 sm:border-0 sm:pb-0">
            <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-semibold text-warm-ivory sm:mb-4 sm:text-base">
              <span className="sm:hidden">Explore<span className="mt-1 block h-1 w-10 bg-imperial-gold" /></span><span className="hidden sm:inline">Quick Links</span>
            </h3>
            <ul className="space-y-2 sm:hidden">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="flex items-center justify-between gap-2 font-[family-name:var(--font-cormorant)] text-[15px] text-warm-ivory/85 hover:text-imperial-gold">
                    {link.label}<ChevronDown className="h-4 w-4 -rotate-90 text-imperial-gold" />
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="hidden space-y-2.5 sm:block">
              {(Array.isArray(configuredExplore) ? exploreLinks : quickLinks).map((link) => (
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
          <div className="border-b border-imperial-gold/55 pb-3 sm:border-0 sm:pb-0">
            <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-semibold text-warm-ivory sm:mb-4 sm:text-base">
              <span className="sm:hidden">Customer Care<span className="mt-1 block h-1 w-10 bg-imperial-gold" /></span><span className="hidden sm:inline">Customer Service</span>
            </h3>
            <ul className="space-y-2 sm:hidden">
              {careLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="flex items-center justify-between gap-2 font-[family-name:var(--font-cormorant)] text-[15px] text-warm-ivory/85 hover:text-imperial-gold">
                    {link.label}<ChevronDown className="h-4 w-4 -rotate-90 text-imperial-gold" />
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="hidden space-y-2.5 sm:block">
              {desktopCareLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-warm-ivory/60 hover:text-imperial-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="hidden lg:block">
            <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-warm-ivory mb-4 text-base">
              Stay Connected
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>{footerContent?.contactEmail || ''}</span>
              </div>
              <div className="flex items-center gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>{footerContent?.phone || ''}</span>
              </div>
              <div className="flex items-start gap-2 text-warm-ivory/60 text-sm">
                <svg className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>📍 Siliguri, Darjeeling District, West Bengal, India</span>
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
              <label className="flex items-start gap-2 text-[10px] text-warm-ivory/70"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5 accent-imperial-gold" /><span>I agree to receive marketing emails. Unsubscribe anytime.</span></label>
              <button
                type="submit"
                disabled={!consent}
                className="w-full h-9 bg-imperial-gold hover:bg-imperial-gold-light text-deep-walnut text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
              {newsletterError && <p role="alert" className="text-xs text-red-200">{newsletterError}</p>}
            </form>
            {subscribed && <p className="mt-2 text-xs text-warm-ivory/80">Subscription saved.{unsubscribeToken && <button type="button" onClick={handleUnsubscribe} className="ml-2 underline">Unsubscribe from this browser</button>}</p>}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-imperial-gold/55">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-5 py-3 sm:px-6 sm:py-5 lg:px-8">
          <p className="font-[family-name:var(--font-cormorant)] text-xs text-warm-ivory/80 sm:font-[family-name:var(--font-inter)] sm:text-xs sm:text-warm-ivory/40">
            <span className="sm:hidden">&copy; {new Date().getFullYear()} King&apos;s Tea</span>
            <span className="hidden sm:inline">&copy; {new Date().getFullYear()} KING&apos;S TEA. All rights reserved.</span>
          </p>
          <div className="hidden items-center gap-4 sm:flex">
              <span className="text-warm-ivory/40 text-xs">
              Payments:
            </span>
            <span className="text-xs text-warm-ivory/50">Available methods shown at checkout</span>
          </div>
          <div className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-xs text-warm-ivory/80 sm:hidden">
            <Link to="/policies/privacy-policy" className="hover:text-imperial-gold">Privacy</Link>
            <span aria-hidden="true">•</span>
            <Link to="/policies/terms" className="hover:text-imperial-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideFooter = location.pathname === '/shop' || location.pathname.startsWith('/product/');

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
