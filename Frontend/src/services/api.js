// ============================================================
// Frontend/src/services/api.js — FIXED
// Fixes: /auth/profile → /auth/me, getProfile → getMe,
//        401 interceptor logic, added logout endpoint
// ============================================================

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors — FIXED to prevent login-logout loop
// Only redirects to /login if user WAS logged in (had token)
// and this is NOT a login/register/me request
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem('token');
      const isAuthRequest =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register') ||
        error.config?.url?.includes('/auth/me');

      // Only clear token and redirect if user was actually logged in
      // and the 401 is NOT from an auth endpoint (session expired)
      if (hadToken && !isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login only if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      // If user had NO token, do nothing — they're just not logged in
      // This prevents the homepage from redirecting to /login
    }
    return Promise.reject(error);
  }
);

// ============ PRODUCT API ============
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeaturedProducts: () => api.get('/products', { params: { featured: true } }),
  getBestSellers: () => api.get('/products', { params: { bestSeller: true } }),
};

// ============ CATEGORY API ============
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

// ============ COLLECTION API ============
export const collectionAPI = {
  getCollections: (params) => api.get('/collections', { params }),
  getCollectionById: (id) => api.get(`/collections/${id}`),
};

// ============ TESTIMONIAL API ============
export const testimonialAPI = {
  getTestimonials: (params) => api.get('/testimonials', { params }),
  getTestimonialById: (id) => api.get(`/testimonials/${id}`),
};

// ============ BLOG API ============
export const blogAPI = {
  getBlogPosts: (params) => api.get('/blog', { params }),
  getBlogPostById: (id) => api.get(`/blog/${id}`),
};

// ============ SUBSCRIPTION API ============
export const subscriptionAPI = {
  getSubscriptionPlans: (params) => api.get('/subscriptions/plans', { params }),
  getSubscriptionPlanById: (id) => api.get(`/subscriptions/plans/${id}`),
};

// ============ AUTH API ============
// FIXED: getProfile → getMe, /auth/profile → /auth/me, added logout
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),           // FIXED: was getProfile → /auth/profile
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),      // ADDED
};

// ============ ORDER API ============
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

// ============ USER API ============
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// ============ CART API ============
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist', data),
  removeFromWishlist: (id) => api.delete(`/wishlist/${id}`),
};

// ============ REVIEW API ============
export const reviewAPI = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  addReview: (data) => api.post('/reviews', data),
};

// ============ NEWSLETTER API ============
export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter', data),
};

// ============ CONTACT API ============
export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
};

// ============ STATS API ============
export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export default api;
