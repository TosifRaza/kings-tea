import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const adminLogin = (data) => api.post('/auth/login', data);
export const adminLogout = () => api.post('/auth/logout');
export const getAdminMe = () => api.get('/auth/me');

// ── Dashboard ──
export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getRevenueData = () => api.get('/admin/dashboard/revenue');
export const getOrderStatusData = () => api.get('/admin/dashboard/order-status');
export const getTopProducts = () => api.get('/admin/dashboard/top-products');

// ── Products ──
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ── Orders ──
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// ── Customers ──
export const getCustomers = (params) => api.get('/users', { params });
export const getCustomer = (id) => api.get(`/users/${id}`);

// ── Categories ──
export const getCategories = () => api.get('/categories');

export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ── Blog ──
export const getBlogPosts = (params) => api.get('/blog', { params });
export const getBlogPost = (id) => api.get(`/blog/${id}`);
export const createBlogPost = (data) => api.post('/blog', data);
export const updateBlogPost = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => api.delete(`/blog/${id}`);

// ── Subscriptions ──
export const getSubscriptions = (params) => api.get('/subscriptions', { params });
export const cancelSubscription = (id) => api.put(`/subscriptions/${id}/cancel`);

// ── Newsletter ──
export const getNewsletterSubscribers = (params) => api.get('/newsletter', { params });

// ── Contact Messages ──
export const getContactMessages = (params) => api.get('/contact', { params });
export const markContactRead = (id) => api.put(`/contact/${id}/read`);

export default api;
