import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch reviews for a product
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/reviews?productId=${productId}&limit=100`);
      const payload = res.data.data;
      // ResponseHandler flattens paginated `docs` to data[] and exposes totals
      // through `pagination`; accept the wrapped shape as well for compatibility.
      if (Array.isArray(payload)) {
        return { docs: payload, total: res.data.pagination?.total ?? payload.length };
      }
      return {
        docs: payload?.docs || payload?.reviews || [],
        total: payload?.total ?? res.data.pagination?.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Submit a new review (requires login)
export const submitReview = createAsyncThunk(
  'reviews/submit',
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await api.post('/reviews', reviewData);
      return res.data.data; // populated review object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    submitting: false,
    error: null,
    submitted: false,
  },
  reducers: {
    clearReviewState: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
      state.submitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.docs;
        state.total = action.payload.total;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.submitted = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
        state.total += 1;
        state.submitted = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
        state.submitted = false;
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
