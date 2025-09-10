import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
