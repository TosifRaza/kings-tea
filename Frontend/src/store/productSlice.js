// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { productAPI } from '../services/api';
// import { products as staticProducts } from '../assets/data';

// const initialState = {
//   products: staticProducts,
//   totalCount: staticProducts.length,
//   page: 1,
//   limit: 9,
//   filters: {
//     category: '',
//     search: '',
//     sort: 'rating',
//     minPrice: 0,
//     maxPrice: 200,
//     origin: '',
//     fermentation: '',
//   },
//   isLoading: false,
//   error: null,
// };

// export const fetchProducts = createAsyncThunk(
//   'product/fetchProducts',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await productAPI.getProducts(params);
//       // return response.data;
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue('Failed to fetch products');
//     }
//   }
// );

// export const fetchProduct = createAsyncThunk(
//   'product/fetchProduct',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await productAPI.getProduct(id);
//       // return response.data;
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue('Failed to fetch product');
//     }
//   }
// );

// const productSlice = createSlice({
//   name: 'product',
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//       state.page = 1;
//     },
//     setPage: (state, action) => {
//       state.page = action.payload;
//     },
//     clearFilters: (state) => {
//       state.filters = initialState.filters;
//       state.page = 1;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload?.products) {
//           state.products = action.payload.products;
//           state.totalCount = action.payload.totalCount || action.payload.products.length;
//         }
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { setFilters, setPage, clearFilters } = productSlice.actions;
// export default productSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch all products (public)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      const response = await api.get(url);
      // Backend wraps responses in { success, message, data: { products } } or { success, message, data: [...] }
      const payload = response.data.data;
      if (Array.isArray(payload)) {
        return payload;
      } else if (payload && payload.products) {
        return payload.products;
      } else if (payload && payload.data) {
        return Array.isArray(payload.data) ? payload.data : [];
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

// Fetch single product (public)
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      const payload = response.data.data;
      if (payload && payload.product) {
        return payload.product;
      }
      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categorySlug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products?category=${categorySlug}`);
      const payload = response.data.data;
      if (Array.isArray(payload)) {
        return payload;
      } else if (payload && payload.products) {
        return payload.products;
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products by category'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    totalProducts: 0,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.totalProducts = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
        state.products = [];
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      })
      // Fetch Products By Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products by category';
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
