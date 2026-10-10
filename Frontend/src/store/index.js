// ============================================================
// Frontend/src/store/index.js — UPDATED with 4 new reducers
// ============================================================
// INSTRUCTIONS: Replace your existing store/index.js with this file.
// Changes: Added collections, testimonials, blog, subscriptions reducers
// ============================================================

import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import collectionReducer from './collectionSlice';        // NEW
import testimonialReducer from './testimonialSlice';      // NEW
import blogReducer from './blogSlice';                    // NEW
import subscriptionReducer from './subscriptionSlice';    // NEW
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import orderReducer from './orderSlice'
import reviewReducer from './reviewSlice';
import { login, register, getMe, logout } from './authSlice';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearCartOnLogout,
  loadCart,
  saveCart,
} from './cartSlice';

const cartListener = createListenerMiddleware();

cartListener.startListening({
  matcher: isAnyOf(login.fulfilled, register.fulfilled, getMe.fulfilled),
  effect: (_, listenerApi) => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      listenerApi.dispatch(loadCart());
    }
  },
});

cartListener.startListening({
  matcher: isAnyOf(addToCart, removeFromCart, updateQuantity, clearCart),
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(250);
    if (typeof localStorage === 'undefined' || !localStorage.getItem('token')) return;
    const state = listenerApi.getState();
    if (!state.auth.isAuthenticated || !state.cart.ownerId) return;
    listenerApi.dispatch(saveCart(state.cart.items));
  },
});

cartListener.startListening({
  matcher: isAnyOf(logout.fulfilled),
  effect: (_, listenerApi) => listenerApi.dispatch(clearCartOnLogout()),
});

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    collections: collectionReducer,        // NEW
    testimonials: testimonialReducer,      // NEW
    blog: blogReducer,                     // NEW
    subscriptions: subscriptionReducer,    // NEW
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,         
    wishlist: wishlistReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(cartListener.middleware),
});

// Keep the cart immediately available for guests and resilient to refreshes.
if (typeof localStorage !== 'undefined') {
  let previousItems = store.getState().cart.items;
  let previousOwnerId = store.getState().cart.ownerId;
  store.subscribe(() => {
    const { items, ownerId } = store.getState().cart;
    if (items === previousItems && ownerId === previousOwnerId) return;
    previousItems = items;
    previousOwnerId = ownerId;
    try {
      localStorage.setItem('kingsTeaCart', JSON.stringify({ version: 1, ownerId, items }));
    } catch {
      // The in-memory cart remains usable if browser storage is unavailable.
    }
  });
}

export default store;
export { store };
