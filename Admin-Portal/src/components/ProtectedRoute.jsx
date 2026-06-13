// ============================================================
// Admin-Portal/src/components/ProtectedRoute.jsx — FIXED
// ============================================================
// INSTRUCTIONS: Replace your existing ProtectedRoute.jsx with this file.
// Fix: Waits for auth check to complete before redirecting.
//      Also doesn't trigger checkAuth if already authenticated.
// ============================================================

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../store/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, authChecked, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only check auth once on mount, and only if not already checked
    if (!authChecked) {
      dispatch(checkAuth());
    }
  }, [dispatch, authChecked]);

  // Show loading while checking auth
  if (loading && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1F4D3A]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render children
  return children;
};

export default ProtectedRoute;
