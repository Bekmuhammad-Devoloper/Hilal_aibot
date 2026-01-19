import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  telegramLogin: (code: string) =>
    api.post('/api/auth/telegram-login', { code }),
  getProfile: () => api.get('/api/auth/profile'),
};

// Stats
export const statsApi = {
  getDashboard: () => api.get('/api/stats/dashboard'),
  getRecentRequests: (limit?: number) =>
    api.get('/api/stats/recent-requests', { params: { limit } }),
  getTopUsers: (limit?: number) =>
    api.get('/api/stats/top-users', { params: { limit } }),
  getDaily: (days?: number) =>
    api.get('/api/stats/daily', { params: { days } }),
};

// Channels
export const channelsApi = {
  getAll: () => api.get('/api/channels'),
  getById: (id: number) => api.get(`/api/channels/${id}`),
  create: (data: any) => api.post('/api/channels', data),
  update: (id: number, data: any) => api.put(`/api/channels/${id}`, data),
  delete: (id: number) => api.delete(`/api/channels/${id}`),
  toggleMandatory: (id: number) => api.post(`/api/channels/${id}/toggle-mandatory`),
  toggleActive: (id: number) => api.post(`/api/channels/${id}/toggle-active`),
};

// Posts
export const postsApi = {
  getAll: () => api.get('/api/posts'),
  getById: (id: number) => api.get(`/api/posts/${id}`),
  getStats: () => api.get('/api/posts/stats'),
  create: (data: any) => api.post('/api/posts', data),
  update: (id: number, data: any) => api.put(`/api/posts/${id}`, data),
  delete: (id: number) => api.delete(`/api/posts/${id}`),
  send: (id: number, channelId: string) =>
    api.post(`/api/posts/${id}/send`, { channelId }),
};

export default api;
