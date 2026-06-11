import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../../store/authSlice';

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(loginForm));
    if (!result.error) {
      onClose();
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }
    if (registerForm.password.length < 6) {
      return;
    }
    const result = await dispatch(
      register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })
    );
    if (!result.error) {
      onClose();
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-deep-walnut/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-warm-ivory border border-imperial-gold/20 overflow-hidden z-10 mx-4"
      >
        {/* Header */}
        <div className="bg-tea-green p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-warm-ivory" />
          </button>
          <img
            src="/images/kings-tea-logo.png"
            alt="KING'S TEA"
            className="h-10 mx-auto mb-2 brightness-0 invert"
          />
          <p className="text-warm-ivory/70 font-[family-name:var(--font-cormorant)] text-sm">
            Enter the world of KING&apos;S TEA
          </p>
        </div>

        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex border-b border-imperial-gold/10 mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                dispatch(clearError());
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-[family-name:var(--font-inter)] transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-imperial-gold text-deep-walnut font-semibold'
                  : 'text-deep-walnut/40'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                dispatch(clearError());
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-[family-name:var(--font-inter)] transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-imperial-gold text-deep-walnut font-semibold'
                  : 'text-deep-walnut/40'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="text-royal-terracotta text-xs font-[family-name:var(--font-inter)] bg-royal-terracotta/5 p-3 rounded-sm border border-royal-terracotta/10 mb-4">
              {typeof error === 'string' ? error : 'An error occurred'}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                    className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                    className="pl-9 pr-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-deep-walnut/30" />
                    ) : (
                      <Eye className="h-4 w-4 text-deep-walnut/30" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="text-imperial-gold text-xs font-[family-name:var(--font-inter)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-tea-green hover:bg-tea-green-light text-warm-ivory h-10 text-xs font-semibold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        name: e.target.value,
                      })
                    }
                    required
                    className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="Your name"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                    className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-walnut/30" />
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="pl-9 h-10 border border-imperial-gold/20 text-sm w-full bg-white px-3 focus:outline-none focus:border-imperial-gold"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-tea-green hover:bg-tea-green-light text-warm-ivory h-10 text-xs font-semibold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
