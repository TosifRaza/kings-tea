// ============================================================
// Admin-Portal/src/services/api.js — FINAL VERSION
// ============================================================
// INSTRUCTIONS: Replace your existing Admin-Portal api.js with this file.
// This file contains EVERY named export that pages and slices import.
// No more missing export errors.
// ============================================================

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem('token');
      const isAuthRequest = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register');

      if (hadToken && !isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// OBJECT-STYLE EXPORTS (for authSlice etc.)
// ============================================================

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const collectionAPI = {
  getCollections: (params) => api.get('/collections', { params }),
  getCollectionById: (id) => api.get(`/collections/${id}`),
  createCollection: (data) => api.post('/collections', data),
  updateCollection: (id, data) => api.put(`/collections/${id}`, data),
  deleteCollection: (id) => api.delete(`/collections/${id}`),
};

export const testimonialAPI = {
  getTestimonials: (params) => api.get('/testimonials', { params }),
  getTestimonialById: (id) => api.get(`/testimonials/${id}`),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
};

export const blogAPI = {
  getBlogPosts: (params) => api.get('/blog', { params }),
  getBlogPostById: (id) => api.get(`/blog/${id}`),
  createBlogPost: (data) => api.post('/blog', data),
  updateBlogPost: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/blog/${id}`),
};

export const subscriptionAPI = {
  getSubscriptionPlans: (params) => api.get('/subscriptions', { params }),
  getSubscriptionPlanById: (id) => api.get(`/subscriptions/${id}`),
  createSubscriptionPlan: (data) => api.post('/subscriptions', data),
  updateSubscriptionPlan: (id, data) => api.put(`/subscriptions/${id}`, data),
  deleteSubscriptionPlan: (id) => api.delete(`/subscriptions/${id}`),
  cancelSubscription: (id) => api.put(`/subscriptions/${id}/cancel`),
  getSubscriptions: (params) => api.get('/subscriptions', { params }),
};

export const orderAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
  getDashboardStats: () => api.get('/stats'),
  getRevenueData: () => api.get('/stats', { params: { type: 'revenue' } }),
  getOrderStatusData: () => api.get('/stats', { params: { type: 'orderStatus' } }),
  getTopProducts: () => api.get('/stats', { params: { type: 'topProducts' } }),
};

export const newsletterAPI = {
  getSubscribers: (params) => api.get('/newsletter', { params }),
  getNewsletterSubscribers: (params) => api.get('/newsletter', { params }),
  deleteSubscriber: (id) => api.delete(`/newsletter/${id}`),
  sendNewsletter: (data) => api.post('/newsletter/send', data),
};

export const contactAPI = {
  getMessages: (params) => api.get('/contact', { params }),
  getContactMessages: (params) => api.get('/contact', { params }),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
  markMessageRead: (id) => api.put(`/contact/${id}/read`),
  markContactRead: (id) => api.put(`/contact/${id}/read`),
};

export const reviewAPI = {
  getReviews: (params) => api.get('/reviews', { params }),
  approveReview: (id) => api.put(`/reviews/${id}/approve`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// ============================================================
// NAMED EXPORTS — Exact names pages and slices import
// ============================================================

// --- Auth ---
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const logout = () => api.post('/auth/logout');

// --- Dashboard / Stats (dashboardSlice) ---
export const getDashboardStats = () => api.get('/stats');
export const getRevenueData = () => api.get('/stats', { params: { type: 'revenue' } });
export const getOrderStatusData = () => api.get('/stats', { params: { type: 'orderStatus' } });
export const getTopProducts = () => api.get('/stats', { params: { type: 'topProducts' } });

// --- Orders (orderSlice) ---
export const getOrders = (params) => api.get('/orders', { params });
export const getOrderById = (id) => api.get(`/orders/${id}`);
// export const updateOrderStatus = (id, data) => api.put(`/orders/${id}`, data);
export const updateOrderStatus = (id, data) => api.patch(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// --- Customers / Users (customerSlice) ---
export const getCustomers = (params) => api.get('/users', { params });
export const getCustomerById = (id) => api.get(`/users/${id}`);
export const updateCustomer = (id, data) => api.put(`/users/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/users/${id}`);

// --- Products (productSlice) ---
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// --- Categories (categorySlice + CategoryManagementPage) ---
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// --- Collections ---
export const getCollections = (params) => api.get('/collections', { params });
export const getCollectionById = (id) => api.get(`/collections/${id}`);
export const createCollection = (data) => api.post('/collections', data);
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/collections/${id}`);

// --- Testimonials ---
export const getTestimonials = (params) => api.get('/testimonials', { params });
export const getTestimonialById = (id) => api.get(`/testimonials/${id}`);
export const createTestimonial = (data) => api.post('/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

// --- Blog (BlogManagementPage) ---
export const getBlogPosts = (params) => api.get('/blog', { params });
export const getBlogPostById = (id) => api.get(`/blog/${id}`);
export const createBlogPost = (data) => api.post('/blog', data);
export const updateBlogPost = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => api.delete(`/blog/${id}`);

// --- Subscriptions (SubscriptionManagementPage) ---
export const getSubscriptionPlans = (params) => api.get('/subscriptions', { params });
export const getSubscriptionPlanById = (id) => api.get(`/subscriptions/${id}`);
export const createSubscriptionPlan = (data) => api.post('/subscriptions', data);
export const updateSubscriptionPlan = (id, data) => api.put(`/subscriptions/${id}`, data);
export const deleteSubscriptionPlan = (id) => api.delete(`/subscriptions/${id}`);
export const cancelSubscription = (id) => api.put(`/subscriptions/${id}/cancel`);
export const getSubscriptions = (params) => api.get('/subscriptions', { params });

// --- Newsletter (NewsletterManagementPage) ---
export const getSubscribers = (params) => api.get('/newsletter', { params });
export const getNewsletterSubscribers = (params) => api.get('/newsletter', { params });
export const deleteSubscriber = (id) => api.delete(`/newsletter/${id}`);
export const sendNewsletter = (data) => api.post('/newsletter/send', data);

// --- Contact Messages (ContactMessagesPage) ---
export const getMessages = (params) => api.get('/contact', { params });
export const getContactMessages = (params) => api.get('/contact', { params });
export const deleteMessage = (id) => api.delete(`/contact/${id}`);
export const markMessageRead = (id) => api.put(`/contact/${id}/read`);
export const markContactRead = (id) => api.put(`/contact/${id}/read`);

// --- Reviews ---
export const getReviews = (params) => api.get('/reviews', { params });
export const approveReview = (id) => api.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// ============================================================
// ALTERNATE NAMES — Any other naming convention your files use
// ============================================================
export const getRecentOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getCustomer = (id) => api.get(`/users/${id}`);
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategory = (id) => api.get(`/categories/${id}`);
export const getCollection = (id) => api.get(`/collections/${id}`);
export const getTestimonial = (id) => api.get(`/testimonials/${id}`);
export const getBlogPost = (id) => api.get(`/blog/${id}`);
export const getSubscriptionPlan = (id) => api.get(`/subscriptions/${id}`);
export const getSubscriberById = (id) => api.get(`/newsletter/${id}`);
export const getContactById = (id) => api.get(`/contact/${id}`);
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);
export const deleteContact = (id) => api.delete(`/contact/${id}`);
export const getContacts = (params) => api.get('/contact', { params });
export const updateSubscription = (id, data) => api.put(`/subscriptions/${id}`, data);
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);
export const createNewsletter = (data) => api.post('/newsletter', data);
export const updateNewsletter = (id, data) => api.put(`/newsletter/${id}`, data);
export const deleteNewsletter = (id) => api.delete(`/newsletter/${id}`);
export const updateSubscriber = (id, data) => api.put(`/newsletter/${id}`, data);
export const toggleSubscriberStatus = (id) => api.put(`/newsletter/${id}/toggle`);

export default api;
