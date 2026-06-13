import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testimonialAPI } from '../services/api';

// Async thunks
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await testimonialAPI.getTestimonials(params);
      return response.data.data.testimonials;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch testimonials'
      );
    }
  }
);

export const fetchTestimonialById = createAsyncThunk(
  'testimonials/fetchTestimonialById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await testimonialAPI.getTestimonialById(id);
      return response.data.data.testimonial;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch testimonial'
      );
    }
  }
);

// Slice
const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState: {
    testimonials: [],
    currentTestimonial: null,
    loading: false,
    error: null
  },
  reducers: {
    clearTestimonialError: (state) => {
      state.error = null;
    },
    clearCurrentTestimonial: (state) => {
      state.currentTestimonial = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Testimonial By ID
      .addCase(fetchTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload;
      })
      .addCase(fetchTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTestimonialError, clearCurrentTestimonial } = testimonialSlice.actions;
export default testimonialSlice.reducer;
