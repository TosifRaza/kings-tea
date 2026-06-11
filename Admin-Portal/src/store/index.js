import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import customerReducer from './customerSlice';
import categoryReducer from './categorySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    products: productReducer,
    categories: categoryReducer,   // ← ADD THIS
    orders: orderReducer,
    customers: customerReducer,
  },
});

export default store;
