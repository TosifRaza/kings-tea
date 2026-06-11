import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductManagementPage from '../pages/ProductManagementPage';
import OrderManagementPage from '../pages/OrderManagementPage';
import CustomerManagementPage from '../pages/CustomerManagementPage';
import CategoryManagementPage from '../pages/CategoryManagementPage';
import BlogManagementPage from '../pages/BlogManagementPage';
import SubscriptionManagementPage from '../pages/SubscriptionManagementPage';
import NewsletterManagementPage from '../pages/NewsletterManagementPage';
import ContactMessagesPage from '../pages/ContactMessagesPage';
// import ProductsPage from './pages/ProductsPage';
const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected admin routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/customers" element={<CustomerManagementPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/blog" element={<BlogManagementPage />} />
        <Route path="/subscriptions" element={<SubscriptionManagementPage />} />
        <Route path="/newsletter" element={<NewsletterManagementPage />} />
        <Route path="/contact" element={<ContactMessagesPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
