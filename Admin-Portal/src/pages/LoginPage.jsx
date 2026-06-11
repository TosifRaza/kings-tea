import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginAdmin, clearAuthError } from '../store/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("LOGIN BUTTON CLICKED");
    dispatch(clearAuthError());
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-deep-walnut flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-tea-green relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-imperial-gold/30 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-royal-terracotta/20 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <Crown className="w-20 h-20 text-imperial-gold mx-auto mb-6" />
          <h1 className="font-playfair text-5xl font-bold text-warm-ivory mb-4">
            KING&apos;S TEA
          </h1>
          <p className="text-warm-ivory/70 text-lg max-w-md mx-auto leading-relaxed">
            Admin Portal — Manage your luxury tea empire with elegance and precision.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Crown className="w-12 h-12 text-imperial-gold mx-auto mb-3" />
            <h1 className="font-playfair text-3xl font-bold text-warm-ivory">
              KING&apos;S TEA
            </h1>
          </div>

          <h2 className="font-playfair text-2xl font-bold text-warm-ivory mb-2">
            Welcome back
          </h2>
          <p className="text-warm-ivory/50 mb-8">
            Sign in to your admin account
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-royal-terracotta/20 border border-royal-terracotta/30 rounded-lg px-4 py-3 mb-6"
            >
              <p className="text-sm text-royal-terracotta">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-warm-ivory/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-ivory/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/10 text-warm-ivory placeholder:text-warm-ivory/30 focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                  placeholder="admin@kingstea.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-ivory/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-ivory/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/10 text-warm-ivory placeholder:text-warm-ivory/30 focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/40 hover:text-warm-ivory/70"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-imperial-gold text-deep-walnut font-semibold rounded-lg hover:bg-imperial-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-imperial-gold/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-deep-walnut border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-warm-ivory/30 mt-8">
            KING&apos;S TEA Admin Portal &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
