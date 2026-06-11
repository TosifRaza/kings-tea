import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/authSlice';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  FileText,
  CreditCard,
  Mail,
  MessageSquare,
  LogOut,
  Crown
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/categories', icon: FolderTree, label: 'Categories' },
  { to: '/blog', icon: FileText, label: 'Blog Posts' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/newsletter', icon: Mail, label: 'Newsletter' },
  { to: '/contact', icon: MessageSquare, label: 'Contact Messages' },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-warm-ivory/10">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-imperial-gold flex-shrink-0" />
          <div>
            <h1 className="font-playfair text-lg font-bold text-warm-ivory leading-tight">
              KING'S TEA
            </h1>
            <p className="text-[10px] text-imperial-gold/70 tracking-widest uppercase">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-imperial-gold/15 text-imperial-gold'
                  : 'text-warm-ivory/60 hover:bg-warm-ivory/5 hover:text-warm-ivory/90'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout - pinned to bottom */}
      <div className="px-3 py-4 border-t border-warm-ivory/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-ivory/60 hover:bg-royal-terracotta/15 hover:text-royal-terracotta transition-colors w-full"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;