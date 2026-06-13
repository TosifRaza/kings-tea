import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../services/api';

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Backend returns: { data: [orders], pagination: {...} }
        if (payload.data) {
          // data can be an array directly OR an object with docs/orders inside
          if (Array.isArray(payload.data)) {
            state.orders = payload.data;
          } else {
            state.orders = payload.data.docs || payload.data.orders || [];
          }
        } else if (Array.isArray(payload)) {
          state.orders = payload;
        } else {
          state.orders = [];
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export const selectOrders = (state) => state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.loading;

export default orderSlice.reducer;