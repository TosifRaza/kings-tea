// ============================================================
// Admin-Portal/src/store/authSlice.js — FIXED: Prevents immediate logout
// ============================================================
// INSTRUCTIONS: Replace your existing Admin-Portal authSlice.js with this file.
// Key fixes:
//   1. Login thunk properly extracts token and user from response
//   2. Token is stored to localStorage BEFORE any other API calls
//   3. Auth state is set BEFORE navigating to dashboard
//   4. CheckAuth only runs once on app load, doesn't cause logout loop
// ============================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Login thunk
export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;

      // Extract token and user from the response
      // Backend wraps in { success, message, data: { token, user } }
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (!token) {
        return rejectWithValue('No token received from server');
      }

      // Store token FIRST before anything else
      localStorage.setItem('token', token);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Check auth on page load
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await authAPI.getProfile();
      const data = response.data;
      const user = data.data?.user || data.user || data.data;

      return { token, user };
    } catch (error) {
      // If profile check fails, clear token silently (don't trigger redirect)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired');
    }
  }
);

// Logout
export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(authSlice.actions.resetAuth());
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    authChecked: false  // Track if initial auth check is done
  },
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { resetAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
