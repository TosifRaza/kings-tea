import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../store/customerSlice';
import DataTable from '../components/DataTable';

const CustomerManagementPage = () => {
  const dispatch = useDispatch();
  const { items: customers, loading } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tea-green/10 flex items-center justify-center text-tea-green font-semibold text-sm">
            {value ? value.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="font-medium text-deep-walnut">{value || '—'}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <span className="text-deep-walnut/70">{value || '—'}</span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => {
        const roleStyles = {
          admin: 'bg-royal-terracotta/10 text-royal-terracotta',
          manager: 'bg-imperial-gold/10 text-imperial-gold',
          customer: 'bg-tea-green/10 text-tea-green',
          user: 'bg-tea-green/10 text-tea-green',
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              roleStyles[value] || roleStyles.user
            }`}
          >
            {value || 'customer'}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
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
      <div>
        <h1 className="text-2xl font-bold text-deep-walnut font-playfair">
          Customers
        </h1>
        <p className="text-sm text-deep-walnut/50 mt-1">
          View and manage your customer base
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-5">
          <p className="text-sm text-deep-walnut/50">Total Customers</p>
          <p className="text-2xl font-bold text-deep-walnut mt-1">
            {customers.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-5">
          <p className="text-sm text-deep-walnut/50">New This Month</p>
          <p className="text-2xl font-bold text-tea-green mt-1">
            {
              customers.filter((c) => {
                const d = new Date(c.createdAt);
                const now = new Date();
                return (
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-5">
          <p className="text-sm text-deep-walnut/50">Admin Users</p>
          <p className="text-2xl font-bold text-royal-terracotta mt-1">
            {customers.filter((c) => c.role === 'admin' || c.role === 'manager').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        emptyMessage="No customers found"
        searchPlaceholder="Search customers..."
      />
    </div>
  );
};

export default CustomerManagementPage;
