import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ban, CreditCard, RefreshCw } from 'lucide-react';
import DataTable from '../components/DataTable';
import { getSubscriptions, cancelSubscription } from '../services/api';

const SubscriptionManagementPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptions();
      const data = res.data;
      setSubscriptions(
        Array.isArray(data) ? data : data.subscriptions || data.items || []
      );
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelSubscription(id);
      loadSubscriptions();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const statusStyles = {
    active: 'bg-tea-green/10 text-tea-green',
    paused: 'bg-imperial-gold/10 text-imperial-gold',
    cancelled: 'bg-royal-terracotta/10 text-royal-terracotta',
  };

  const columns = [
    {
      key: 'user',
      label: 'Customer',
      render: (value) => (
        <span className="font-medium text-deep-walnut">
          {typeof value === 'object' ? value?.name || value?.email : value || '—'}
        </span>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (value) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-imperial-gold" />
          <span className="font-medium text-deep-walnut capitalize">
            {value || 'Basic'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            statusStyles[value] || statusStyles.active
          }`}
        >
          {value || 'active'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => (
        <span className="font-semibold text-deep-walnut">
          ${typeof value === 'number' ? value.toFixed(2) : value || '0.00'}
          <span className="text-deep-walnut/40 text-xs">/mo</span>
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value) => (
        <span className="text-deep-walnut/60">
          {value
            ? new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-walnut font-playfair">
            Subscriptions
          </h1>
          <p className="text-sm text-deep-walnut/50 mt-1">
            Manage tea subscription plans
          </p>
        </div>
        <button
          onClick={loadSubscriptions}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-imperial-gold/10 p-5"
        >
          <p className="text-sm text-deep-walnut/50">Active</p>
          <p className="text-2xl font-bold text-tea-green mt-1">
            {subscriptions.filter((s) => s.status === 'active').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-imperial-gold/10 p-5"
        >
          <p className="text-sm text-deep-walnut/50">Paused</p>
          <p className="text-2xl font-bold text-imperial-gold mt-1">
            {subscriptions.filter((s) => s.status === 'paused').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-imperial-gold/10 p-5"
        >
          <p className="text-sm text-deep-walnut/50">Monthly Revenue</p>
          <p className="text-2xl font-bold text-deep-walnut mt-1">
            $
            {subscriptions
              .filter((s) => s.status === 'active')
              .reduce((sum, s) => sum + (s.price || 0), 0)
              .toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        emptyMessage="No subscriptions found"
        searchPlaceholder="Search subscriptions..."
        actions={(row) =>
          row.status !== 'cancelled' ? (
            <button
              onClick={() => handleCancel(row._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-royal-terracotta bg-royal-terracotta/10 rounded-lg hover:bg-royal-terracotta/20 transition-colors"
            >
              <Ban className="w-3 h-3" />
              Cancel
            </button>
          ) : null
        }
      />
    </div>
  );
};

export default SubscriptionManagementPage;
