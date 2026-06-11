export const API_URL = 'http://localhost:5000/api';

export const COLORS = {
  teaGreen: '#1F4D3A',
  warmIvory: '#F8F3E9',
  royalTerracotta: '#A65A3A',
  imperialGold: '#C9A86A',
  deepWalnut: '#3A281C',
};

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#C9A86A' },
  { value: 'processing', label: 'Processing', color: '#1F4D3A' },
  { value: 'shipped', label: 'Shipped', color: '#3B82F6' },
  { value: 'delivered', label: 'Delivered', color: '#10B981' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
];

export const PRODUCT_STATUSES = [
  { value: 'active', label: 'Active', color: '#10B981' },
  { value: 'draft', label: 'Draft', color: '#C9A86A' },
  { value: 'archived', label: 'Archived', color: '#6B7280' },
];

export const SUBSCRIPTION_STATUSES = [
  { value: 'active', label: 'Active', color: '#10B981' },
  { value: 'paused', label: 'Paused', color: '#C9A86A' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
];

export const ADMIN_ROLES = ['admin', 'manager', 'super_admin'];
