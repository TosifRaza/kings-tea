import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../services/api';

const initialState = {
  items: [],
  isLoading: false,
};

export const loadWishlist = createAsyncThunk(
  'wishlist/loadWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      // return response.data;
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to load wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { getState, rejectWithValue }) => {
    const state = getState();
    const isWishlisted = state.wishlist.items.includes(productId);
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(productId);
      } else {
        await wishlistAPI.addToWishlist(productId);
      }
      return { productId, removing: isWishlisted };
    } catch (error) {
      return rejectWithValue('Failed to toggle wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlistLocal: (state, action) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },
    toggleWishlistLocal: (state, action) => {
      const productId = action.payload;
      if (state.items.includes(productId)) {
        state.items = state.items.filter((id) => id !== productId);
      } else {
        state.items.push(productId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.fulfilled, (state, action) => {
        if (action.payload?.wishlist) {
          state.items = action.payload.wishlist.map((item) =>
            typeof item === 'string' ? item : item.productId || item._id
          );
        }
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, removing } = action.payload;
        if (removing) {
          state.items = state.items.filter((id) => id !== productId);
        } else {
          if (!state.items.includes(productId)) {
            state.items.push(productId);
          }
        }
      });
  },
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  toggleWishlistLocal,
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (state, productId) =>
  state.wishlist.items.includes(productId);

export default wishlistSlice.reducer;
