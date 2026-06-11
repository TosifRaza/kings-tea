import { Routes, Route } from 'react-router-dom';
import useScrollTop from '../hooks/useScrollTop';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CulturePage from '../pages/CulturePage';
import SubscriptionPage from '../pages/SubscriptionPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import DashboardPage from '../pages/DashboardPage';
import CheckoutPage from '../pages/CheckoutPage';

export default function AppRoutes() {
  useScrollTop();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/culture" element={<CulturePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}
