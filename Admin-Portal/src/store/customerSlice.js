import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers } from '../services/api';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getCustomers(params);
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customers'
      );
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCustomerPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.items = data;
          state.totalCount = data.length;
        } else {
          state.items = data.users || data.items || [];
          state.totalCount = data.totalCount || data.total || state.items.length;
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCustomerPage } = customerSlice.actions;
export default customerSlice.reducer;
