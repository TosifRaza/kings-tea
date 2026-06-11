import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDashboardStats,
  getRevenueData,
  getOrderStatusData,
  getTopProducts,
} from '../services/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStats();
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchRevenueData = createAsyncThunk(
  'dashboard/fetchRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRevenueData();
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch revenue data'
      );
    }
  }
);

export const fetchOrderStatusData = createAsyncThunk(
  'dashboard/fetchOrderStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrderStatusData();
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order status data'
      );
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTopProducts();
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch top products'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
    },
    revenueData: [],
    orderStatusData: [],
    topProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.revenueData = action.payload;
      })
      .addCase(fetchOrderStatusData.fulfilled, (state, action) => {
        state.orderStatusData = action.payload;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
