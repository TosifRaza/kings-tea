import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { fetchOrders } from '../store/orderSlice';
import { fetchCustomers } from '../store/customerSlice';
import StatsCard from '../components/StatsCard';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items: products, totalCount: productCount } = useSelector((state) => state.products);
  const { items: orders, totalCount: orderCount } = useSelector((state) => state.orders);
  const { items: customers, totalCount: customerCount } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Calculate order status counts
  const orderStatusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: 8.2,
      changeLabel: 'vs last month',
      color: 'imperial-gold'
    },
    {
      title: 'Total Orders',
      value: orderCount.toLocaleString(),
      icon: ShoppingBag,
      change: 12.5,
      changeLabel: 'vs last month',
      color: 'tea-green'
    },
    {
      title: 'Total Customers',
      value: customerCount.toLocaleString(),
      icon: Users,
      change: 15.3,
      changeLabel: 'vs last month',
      color: 'royal-terracotta'
    },
    {
      title: 'Total Products',
      value: productCount.toLocaleString(),
      icon: Package,
      change: 3.1,
      changeLabel: 'vs last month',
      color: 'blue'
    }
  ];

  const orderStatusItems = [
    { label: 'Pending', count: orderStatusCounts.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Processing', count: orderStatusCounts.processing, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Shipped', count: orderStatusCounts.shipped, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Delivered', count: orderStatusCounts.delivered, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Cancelled', count: orderStatusCounts.cancelled, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-playfair font-bold text-deep-walnut">Dashboard</h1>
        <p className="text-sm text-deep-walnut/50 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status - Left Side (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-imperial-gold/10 p-6">
          <h3 className="text-lg font-playfair font-semibold text-deep-walnut mb-4">
            Order Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {orderStatusItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-4 rounded-lg ${item.bg} border border-transparent`}
              >
                <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                <div>
                  <p className="text-2xl font-bold text-deep-walnut">{item.count}</p>
                  <p className="text-xs text-deep-walnut/50 font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info - Right Side (1 col) */}
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-6">
          <h3 className="text-lg font-playfair font-semibold text-deep-walnut mb-4">
            Quick Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-imperial-gold/5">
              <span className="text-sm text-deep-walnut/60">Active Products</span>
              <span className="text-sm font-semibold text-deep-walnut">
                {products.filter(p => p.inStock).length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-imperial-gold/5">
              <span className="text-sm text-deep-walnut/60">Featured Products</span>
              <span className="text-sm font-semibold text-deep-walnut">
                {products.filter(p => p.featured).length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-imperial-gold/5">
              <span className="text-sm text-deep-walnut/60">Best Sellers</span>
              <span className="text-sm font-semibold text-deep-walnut">
                {products.filter(p => p.bestSeller).length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-imperial-gold/5">
              <span className="text-sm text-deep-walnut/60">New Arrivals</span>
              <span className="text-sm font-semibold text-deep-walnut">
                {products.filter(p => p.isNew).length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-deep-walnut/60">Pending Orders</span>
              <span className="text-sm font-semibold text-royal-terracotta">
                {orderStatusCounts.pending}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-imperial-gold/10 overflow-hidden">
        <div className="p-6 border-b border-imperial-gold/5">
          <h3 className="text-lg font-playfair font-semibold text-deep-walnut">
            Recent Orders
          </h3>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-warm-ivory/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-deep-walnut/50 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-deep-walnut/50 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-deep-walnut/50 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-deep-walnut/50 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-deep-walnut/50 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-imperial-gold/5">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-warm-ivory/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-deep-walnut">
                      #{order._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-deep-walnut/70">
                      {order.user?.name || order.shippingAddress?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-deep-walnut">
                      ${(order.totalAmount || order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-purple-50 text-purple-700' :
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-deep-walnut/50">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-deep-walnut/20 mx-auto mb-3" />
            <p className="text-deep-walnut/40 font-medium">No orders yet</p>
            <p className="text-deep-walnut/30 text-sm mt-1">Orders will appear here when customers make purchases</p>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-imperial-gold/10 overflow-hidden">
        <div className="p-6 border-b border-imperial-gold/5">
          <h3 className="text-lg font-playfair font-semibold text-deep-walnut">
            Top Products
          </h3>
        </div>
        {products.length > 0 ? (
          <div className="divide-y divide-imperial-gold/5">
            {[...products]
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 5)
              .map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-6 py-4 hover:bg-warm-ivory/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-tea-green/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-tea-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-deep-walnut truncate">{product.name}</p>
                    <p className="text-xs text-deep-walnut/40">{product.category} · {product.origin}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-deep-walnut">${product.price}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs text-imperial-gold">★</span>
                      <span className="text-xs text-deep-walnut/50">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-deep-walnut/20 mx-auto mb-3" />
            <p className="text-deep-walnut/40 font-medium">No products yet</p>
            <p className="text-deep-walnut/30 text-sm mt-1">Seed the database to see products here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;