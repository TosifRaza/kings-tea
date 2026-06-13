import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrders, updateOrderStatus } from '../services/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getOrders(params);
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
            const response = await updateOrderStatus(id, { status });
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setOrderPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.items = data;
          state.totalCount = data.length;
        } else {
          // state.items = data.orders || data.items || [];
          state.items = data.docs || data.orders || data.items || [];
          state.totalCount = data.totalCount || data.total || state.items.length;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setOrderPage } = orderSlice.actions;
export default orderSlice.reducer;
