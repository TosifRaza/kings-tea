import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch all products
// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const queryString = new URLSearchParams(params).toString();
//       const url = queryString ? `/products?${queryString}` : '/products';
//       const response = await api.get(url);
//       const payload = response.data.data;
//       if (Array.isArray(payload)) {
//         return payload;
//       } else if (payload && payload.products) {
//         return payload.products;
//       } else if (payload && payload.data) {
//         return Array.isArray(payload.data) ? payload.data : [];
//       }
//       return [];
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch products'
//       );
//     }
//   }
// );

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      const response = await api.get(url);
      console.log('API RESPONSE:', response.data);
      const payload = response.data.data;
      console.log('PAYLOAD:', payload);
      if (Array.isArray(payload)) {
        return payload;
      } else if (payload && payload.products) {
        return payload.products;
      } else if (payload && payload.data) {
        return Array.isArray(payload.data) ? payload.data : [];
      }
      return [];
    } catch (error) {
      console.error('FETCH PRODUCTS ERROR:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

// Fetch single product
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

// Create product (aliased as addProduct)
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const isFormData = productData instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await api.post('/products', productData, config);
      const payload = response.data.data;
      if (payload && payload.product) {
        return payload.product;
      }
      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

// Update product (aliased as editProduct)
export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await api.put(`/products/${id}`, data, config);
      const payload = response.data.data;
      if (payload && payload.product) {
        return payload.product;
      }
      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

// Delete product (aliased as removeProduct)
export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    totalCount: 0,
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
        state.items = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
        state.items = [];
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
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
          state.totalCount += 1;
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (p) => p._id === action.payload?._id
        );
        if (index !== -1 && action.payload) {
          state.items[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })
      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;