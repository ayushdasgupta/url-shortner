import axios from 'axios';
import { getToken, removeToken } from './auth';
import toast from 'react-hot-toast';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      toast.error('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const createLink = async (linkData) => {
  try {
    const response = await api.post('/links', linkData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create link');
  }
};

export const getUserLinks = async () => {
  try {
    const response = await api.get('/links');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch links');
  }
};

export const deleteLink = async (id) => {
  try {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete link');
  }
};

export const getLinkAnalytics = async (id) => {
  try {
    const response = await api.get(`/links/${id}/analytics`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};

export const getDashboardAnalytics = async () => {
  try {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

export default api;