import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cb_token')
      localStorage.removeItem('cb_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (formData) => api.post('/auth/register', formData),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const buildingAPI = {
  create: (formData) => api.post('/buildings', formData),
  getAll: (params) => api.get('/buildings', { params }),
  getMine: () => api.get('/buildings/my'),
  getById: (id) => api.get(`/buildings/${id}`),
  assign: (id) => api.post(`/buildings/${id}/assign`),
  complete: (id, data) => api.put(`/buildings/${id}/complete`, data),
}

export const chatAPI = {
  send: (formData) => api.post('/chat/send', formData),
  getMessages: (buildingId) => api.get(`/chat/${buildingId}`),
}

export default api
