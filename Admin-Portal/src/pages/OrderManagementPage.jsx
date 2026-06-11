import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, changeOrderStatus } from '../store/orderSlice';
import DataTable from '../components/DataTable';
import OrderStatusSelect from '../components/OrderStatusSelect';

const OrderManagementPage = () => {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(changeOrderStatus({ id: orderId, status: newStatus }));
  };

  const columns = [
    {
      key: '_id',
      label: 'Order ID',
      render: (value) => (
        <span className="font-mono text-xs text-deep-walnut/70">
          {value?.slice(-8).toUpperCase() || '—'}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (value) => (
        <span className="text-deep-walnut">
          {typeof value === 'object' ? value?.name || value?.email : value || '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-deep-walnut/70">
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
      key: 'total',
      label: 'Total',
      render: (value) => (
        <span className="font-semibold text-deep-walnut">
          ${typeof value === 'number' ? value.toFixed(2) : value || '0.00'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => (
        <OrderStatusSelect
          currentStatus={value || 'pending'}
          onChange={(newStatus) => handleStatusChange(row._id, newStatus)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-deep-walnut font-playfair">
          Orders
        </h1>
        <p className="text-sm text-deep-walnut/50 mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Pending',
            count: orders.filter((o) => o.status === 'pending').length,
            color: 'bg-imperial-gold/10 text-imperial-gold',
          },
          {
            label: 'Processing',
            count: orders.filter((o) => o.status === 'processing').length,
            color: 'bg-tea-green/10 text-tea-green',
          },
          {
            label: 'Shipped',
            count: orders.filter((o) => o.status === 'shipped').length,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Delivered',
            count: orders.filter((o) => o.status === 'delivered').length,
            color: 'bg-emerald-50 text-emerald-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-imperial-gold/10 p-4"
          >
            <p className="text-xs font-medium text-deep-walnut/50">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color.split(' ')[1]}`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="No orders found"
        searchPlaceholder="Search orders..."
      />
    </div>
  );
};

export default OrderManagementPage;
