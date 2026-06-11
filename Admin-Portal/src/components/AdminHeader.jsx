import { useSelector } from 'react-redux';
import { Crown } from 'lucide-react';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-imperial-gold/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Crown className="w-5 h-5 text-imperial-gold lg:hidden" />
        <h2 className="text-lg font-playfair font-semibold text-deep-walnut">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-deep-walnut">
            {user?.name || 'Admin'}
          </p>
          <p className="text-xs text-deep-walnut/50">
            {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Super Admin'}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-tea-green flex items-center justify-center">
          <span className="text-sm font-bold text-warm-ivory">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;