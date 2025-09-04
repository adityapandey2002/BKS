// client/src/store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/cart`;

// Backend-synced cart operations
export const getCart = createAsyncThunk('cart/get', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const { data } = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
    return data.data || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const { data } = await axios.post(API, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    return data.data || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQty', async ({ productId, quantity }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const { data } = await axios.patch(`${API}/item`, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    return data.data || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async ({ productId }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const { data } = await axios.delete(`${API}/item/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
    return data.data || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

const initialState = {
  items: [],
  totalAmount: 0,
  isLoading: false,
  error: null,
};

const calcTotal = (items) =>
  items.reduce((sum, it) => sum + (it.price || it.product?.price || 0) * it.quantity, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const fulfilled = (state, action) => {
      state.isLoading = false;
      const payload = action.payload;
      const items = payload.items || payload?.data?.items || payload?.data || [];
      state.items = items;
      state.totalAmount = payload.totalAmount ?? calcTotal(items);
    };
    const pending = (state) => { state.isLoading = true; state.error = null; };
    const rejected = (state, action) => { state.isLoading = false; state.error = action.payload; };

    builder
      .addCase(getCart.pending, pending)
      .addCase(getCart.fulfilled, fulfilled)
      .addCase(getCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, fulfilled)
      .addCase(addToCart.rejected, rejected)
      .addCase(updateQuantity.pending, pending)
      .addCase(updateQuantity.fulfilled, fulfilled)
      .addCase(updateQuantity.rejected, rejected)
      .addCase(removeFromCart.pending, pending)
      .addCase(removeFromCart.fulfilled, fulfilled)
      .addCase(removeFromCart.rejected, rejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
