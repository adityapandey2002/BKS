// client/src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products`;

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.featured) queryParams.append('featured', 'true');
    if (params.category) queryParams.append('category', params.category);
    if (params.q) queryParams.append('search', params.q);
    
    const url = queryParams.toString() ? `${API}?${queryParams.toString()}` : API;
    const { data } = await axios.get(url);
    return data; // expect array or {data:[]}, adjust as needed
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // details
      .addCase(fetchProductById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload?.data || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearCurrent } = productSlice.actions;
export default productSlice.reducer;

