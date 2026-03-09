import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (formData) => api.post('/auth/register', formData),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Buildings ─────────────────────────────────────────────────────────────────
export const buildingAPI = {
  create: (formData) => api.post('/buildings', formData),
  getAll: (params) => api.get('/buildings', { params }),
  getMine: () => api.get('/buildings/my'),
  getById: (id) => api.get(`/buildings/${id}`),
  assign: (id) => api.post(`/buildings/${id}/assign`),
  complete: (id, data) => api.put(`/buildings/${id}/complete`, data),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (formData) => api.post('/chat/send', formData),
  getMessages: (buildingId) => api.get(`/chat/${buildingId}`),
};

export default api;
