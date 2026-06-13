// ============================================================
// Frontend/src/store/index.js — UPDATED with 4 new reducers
// ============================================================
// INSTRUCTIONS: Replace your existing store/index.js with this file.
// Changes: Added collections, testimonials, blog, subscriptions reducers
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
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
    wishlist: wishlistReducer
  }
});

export default store;
export { store };
