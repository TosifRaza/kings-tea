import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import { getNewsletterSubscribers } from '../services/api';

const NewsletterManagementPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await getNewsletterSubscribers();
      const data = res.data;
      setSubscribers(
        Array.isArray(data) ? data : data.subscribers || data.items || []
      );
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'].join(','),
      ...subscribers.map((s) =>
        [s.email, s.createdAt ? new Date(s.createdAt).toISOString() : ''].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'newsletter-subscribers.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-imperial-gold/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-imperial-gold" />
          </div>
          <span className="font-medium text-deep-walnut">{value}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Subscribed',
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
    {
      key: 'active',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            value !== false
              ? 'bg-tea-green/10 text-tea-green'
              : 'bg-royal-terracotta/10 text-royal-terracotta'
          }`}
        >
          {value !== false ? 'Active' : 'Unsubscribed'}
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
            Newsletter
          </h1>
          <p className="text-sm text-deep-walnut/50 mt-1">
            Manage newsletter subscribers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={loadSubscribers}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-imperial-gold/10 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-tea-green/10">
              <Mail className="w-6 h-6 text-tea-green" />
            </div>
            <div>
              <p className="text-sm text-deep-walnut/50">Total Subscribers</p>
              <p className="text-2xl font-bold text-deep-walnut">
                {subscribers.length}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-imperial-gold/10 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-imperial-gold/10">
              <Mail className="w-6 h-6 text-imperial-gold" />
            </div>
            <div>
              <p className="text-sm text-deep-walnut/50">Active</p>
              <p className="text-2xl font-bold text-tea-green">
                {subscribers.filter((s) => s.active !== false).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={subscribers}
        loading={loading}
        emptyMessage="No subscribers found"
        searchPlaceholder="Search by email..."
      />
    </div>
  );
};

export default NewsletterManagementPage;
