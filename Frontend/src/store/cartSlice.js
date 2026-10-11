import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../services/api';
import { parseWeightGrams } from '../utils/weight';

const CART_STORAGE_KEY = 'kingsTeaCart';

const getId = (value) => {
  if (value && typeof value === 'object') return String(value._id || value.id || '');
  return String(value || '');
};

const normalizeItems = (items = []) => items
  .filter((item) => item && getId(item.productId || item.product?._id || item.product?.id))
  .map((item) => ({
    productId: getId(item.productId || item.product?._id || item.product?.id),
    quantity: Math.max(1, Number(item.quantity) || 1),
    productName: item.productName || item.name || item.product?.name || '',
    price: Number(item.price ?? item.product?.price) || 0,
    image: item.image || item.product?.images?.[0] || '',
    weight: item.weight || item.product?.weight || '',
    weightGrams: Number(item.weightGrams) || parseWeightGrams(item.weight || item.product?.weight) || 100,
  }));

const getCartItemKey = (item) => `${getId(item?.productId)}:${Number(item?.weightGrams) || parseWeightGrams(item?.weight) || 100}`;

const readStoredCart = () => {
  try {
    if (typeof localStorage === 'undefined') return { items: [], ownerId: null };
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null');
    if (!saved) return { items: [], ownerId: null };
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const currentUserId = getId(user?._id || user?.id);
    const savedOwnerId = getId(saved.ownerId) || null;

    // Never show one account's stored cart to a different or signed-out user.
    if (savedOwnerId && (!token || (currentUserId && savedOwnerId !== currentUserId))) {
      return { items: [], ownerId: currentUserId || null };
    }

    return {
      items: normalizeItems(Array.isArray(saved) ? saved : saved.items),
      ownerId: savedOwnerId,
    };
  } catch {
    return { items: [], ownerId: null };
  }
};

const mergeItems = (...lists) => {
  const merged = new Map();
  lists.flat().forEach((rawItem) => {
    const [item] = normalizeItems([rawItem]);
    if (!item) return;
    const key = getCartItemKey(item);
    const existing = merged.get(key);
    merged.set(key, existing
      ? { ...existing, ...item, quantity: existing.quantity + item.quantity }
      : item);
  });
  return [...merged.values()];
};

const initialState = {
  ...readStoredCart(),
  cartOpen: false,
  notification: null,
};

export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await cartAPI.getCart();
      const serverItems = normalizeItems(response.data?.data?.items || []);
      const cart = getState().cart;
      const user = getState().auth.user || JSON.parse(localStorage.getItem('user') || 'null');
      const ownerId = getId(user?._id || user?.id) || null;
      const hasGuestCart = !cart.ownerId && cart.items.length > 0;
      const items = hasGuestCart ? mergeItems(serverItems, cart.items) : serverItems;

      // Bring a guest cart into the customer's saved cart after sign-in.
      if (hasGuestCart) dispatch(saveCart(items));
      return { items, ownerId };
    } catch (error) {
      return rejectWithValue('Failed to load cart');
    }
  }
);

export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (items, { rejectWithValue }) => {
    try {
      const response = await cartAPI.saveCart(normalizeItems(items));
      return response.data?.data;
    } catch (error) {
      return rejectWithValue('Failed to save cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.cartOpen = true;
    },
    closeCart: (state) => {
      state.cartOpen = false;
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    addToCart: {
      reducer: (state, action) => {
        const { productId, quantity = 1 } = action.payload;
        const normalizedId = getId(productId);
        const cartKey = getCartItemKey(action.payload);
        const existing = state.items.find((item) => getCartItemKey(item) === cartKey);
        if (existing) {
          existing.quantity += quantity;
          existing.productName = action.payload.productName || existing.productName;
          existing.price = Number(action.payload.price) || existing.price;
          existing.image = action.payload.image || existing.image;
          existing.weight = action.payload.weight || existing.weight;
          existing.weightGrams = action.payload.weightGrams || existing.weightGrams;
        } else {
          state.items.push({
            productId: normalizedId,
            quantity,
            productName: action.payload.productName,
            price: Number(action.payload.price) || 0,
            image: action.payload.image || '',
            weight: action.payload.weight || '',
            weightGrams: Number(action.payload.weightGrams) || parseWeightGrams(action.payload.weight) || 100,
          });
        }
        state.notification = {
          id: action.payload.notificationId,
          productName: action.payload.productName,
          quantity,
        };
      },
      prepare: ({ productId, quantity = 1, productName = 'Tea', price = 0, image = '', weight = '', weightGrams }) => ({
        payload: {
          productId,
          quantity,
          productName,
          price,
          image,
          weight,
          weightGrams: Number(weightGrams) || parseWeightGrams(weight) || 100,
          notificationId: Date.now(),
        },
      }),
    },
    clearCartNotification: (state, action) => {
      if (state.notification?.id === action.payload) {
        state.notification = null;
      }
    },
    removeFromCart: (state, action) => {
      const target = action.payload && typeof action.payload === 'object' ? action.payload : null;
      state.items = state.items.filter((item) => target
        ? getCartItemKey(item) !== getCartItemKey(target)
        : getId(item.productId) !== getId(action.payload));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity, weightGrams } = action.payload;
      const item = state.items.find((candidate) => getId(candidate.productId) === getId(productId)
        && (weightGrams === undefined || Number(candidate.weightGrams) === Number(weightGrams)));
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((candidate) => candidate !== item);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    clearCartOnLogout: (state) => {
      state.items = [];
      state.ownerId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = normalizeItems(action.payload?.items || []);
      state.ownerId = action.payload?.ownerId || null;
    });
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearCartOnLogout,
  clearCartNotification,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartOpen = (state) => state.cart.cartOpen;
export const selectCartNotification = (state) => state.cart.notification;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
// export const selectCartTotal = (state) => {
//   return state.cart.items.reduce((sum, item) => {
//     const product = staticProducts.find((p) => p.id === item.productId);
//     return sum + (product ? product.price * item.quantity : 0);
//   }, 0);
// };
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
};

export default cartSlice.reducer;
