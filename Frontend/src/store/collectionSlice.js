import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collectionAPI } from '../services/api';

// Async thunks
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await collectionAPI.getCollections(params);
      return response.data.data.collections;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch collections'
      );
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  'collections/fetchCollectionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await collectionAPI.getCollectionById(id);
      return response.data.data.collection;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch collection'
      );
    }
  }
);

// Slice
const collectionSlice = createSlice({
  name: 'collections',
  initialState: {
    collections: [],
    currentCollection: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCollectionError: (state) => {
      state.error = null;
    },
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Collection By ID
      .addCase(fetchCollectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCollectionError, clearCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
