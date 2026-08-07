// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { wishlistAPI } from '../services/api';

// const initialState = {
//   items: [],
//   isLoading: false,
// };

// export const loadWishlist = createAsyncThunk(
//   'wishlist/loadWishlist',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await wishlistAPI.getWishlist();
//       // return response.data;
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue('Failed to load wishlist');
//     }
//   }
// );

// export const toggleWishlist = createAsyncThunk(
//   'wishlist/toggleWishlist',
//   async (productId, { getState, rejectWithValue }) => {
//     const state = getState();
//     const isWishlisted = state.wishlist.items.includes(productId);
//     try {
//       if (isWishlisted) {
//         await wishlistAPI.removeFromWishlist(productId);
//       } else {
//         await wishlistAPI.addToWishlist(productId);
//       }
//       return { productId, removing: isWishlisted };
//     } catch (error) {
//       return rejectWithValue('Failed to toggle wishlist');
//     }
//   }
// );

// const wishlistSlice = createSlice({
//   name: 'wishlist',
//   initialState,
//   reducers: {
//     addToWishlistLocal: (state, action) => {
//       if (!state.items.includes(action.payload)) {
//         state.items.push(action.payload);
//       }
//     },
//     removeFromWishlistLocal: (state, action) => {
//       state.items = state.items.filter((id) => id !== action.payload);
//     },
//     toggleWishlistLocal: (state, action) => {
//       const productId = action.payload;
//       if (state.items.includes(productId)) {
//         state.items = state.items.filter((id) => id !== productId);
//       } else {
//         state.items.push(productId);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadWishlist.fulfilled, (state, action) => {
//         if (action.payload?.wishlist) {
//           state.items = action.payload.wishlist.map((item) =>
//             typeof item === 'string' ? item : item.productId || item._id
//           );
//         }
//       })
//       .addCase(toggleWishlist.fulfilled, (state, action) => {
//         const { productId, removing } = action.payload;
//         if (removing) {
//           state.items = state.items.filter((id) => id !== productId);
//         } else {
//           if (!state.items.includes(productId)) {
//             state.items.push(productId);
//           }
//         }
//       });
//   },
// });

// export const {
//   addToWishlistLocal,
//   removeFromWishlistLocal,
//   toggleWishlistLocal,
// } = wishlistSlice.actions;

// export const selectWishlistItems = (state) => state.wishlist.items;
// export const selectIsWishlisted = (state, productId) =>
//   state.wishlist.items.includes(productId);

// export default wishlistSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../services/api';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Load wishlist from backend on app load (only works if logged in)
export const loadWishlist = createAsyncThunk(
  'wishlist/loadWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      // Handle multiple possible response shapes
      const data = response.data?.data || response.data;
      const list =
        data?.wishlist ||
        data?.items ||
        data?.products ||
        (Array.isArray(data) ? data : []);
      return list;
    } catch (error) {
      // Silent fail if not authenticated (don't crash the app)
      return rejectWithValue(
        error.response?.status === 401 ? 'not-auth' : 'Failed to load wishlist'
      );
    }
  }
);

// Toggle wishlist — persists to DB if logged in, otherwise just local
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const isWishlisted = state.wishlist.items.includes(productId);
    const token = localStorage.getItem('token');

    // Optimistic UI update (instant feedback)
    dispatch(toggleWishlistLocal(productId));

    // If not logged in, just keep the local change (no DB sync)
    if (!token) {
      return { productId, removing: isWishlisted, localOnly: true };
    }

    // Persist to DB
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(productId);
      } else {
        await wishlistAPI.addToWishlist({ productId });
      }
      return { productId, removing: isWishlisted };
    } catch (error) {
      // Revert local update on failure
      dispatch(toggleWishlistLocal(productId));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle wishlist'
      );
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
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadWishlist.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map((item) =>
            typeof item === 'string'
              ? item
              : item.productId || item.product || item._id
          );
        }
        state.isLoading = false;
      })
      .addCase(loadWishlist.rejected, (state) => {
        state.isLoading = false;
      })
      // toggleWishlist already updates state optimistically via dispatch,
      // so fulfilled/rejected don't need to touch state.items again
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  toggleWishlistLocal,
  clearWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (state, productId) =>
  state.wishlist.items.includes(productId);

export default wishlistSlice.reducer;