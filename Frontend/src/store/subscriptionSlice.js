import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionAPI } from '../services/api';

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscriptions/fetchSubscriptionPlans',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionPlans(params);
      return response.data.data.plans || response.data.data.subscriptions || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription plans'
      );
    }
  }
);

export const fetchSubscriptionPlanById = createAsyncThunk(
  'subscriptions/fetchSubscriptionPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionPlanById(id);
      return response.data.data.plan || response.data.data.subscription || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription plan'
      );
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    plans: [],
    currentPlan: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription Plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Subscription Plan By ID
      .addCase(fetchSubscriptionPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSubscriptionError, clearCurrentPlan } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
