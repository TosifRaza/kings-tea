import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/blog');
      const payload = response.data.data;
      if (Array.isArray(payload)) return payload;
      if (payload && payload.blogs) return payload.blogs;
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blogs/fetchBlogBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/slug/${slug}`);
      const payload = response.data.data;
      if (payload && payload.blog) return payload.blog;
      return payload;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [], currentBlog: null, loading: false, error: null },
  reducers: { clearCurrentBlog: (state) => { state.currentBlog = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.loading = true; })
      .addCase(fetchBlogs.fulfilled, (state, action) => { state.loading = false; state.blogs = action.payload; })
      .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => { state.currentBlog = action.payload; });
  },
});

export const { clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
