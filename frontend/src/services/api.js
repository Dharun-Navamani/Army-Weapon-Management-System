import axios from 'axios';

// Create axios instance with base URL pointing to Spring Boot backend
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor - handle 401 errors (expired/invalid token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ======================== AUTH API ========================
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  refresh: (refreshToken) => API.post('/auth/refresh', { refreshToken }),
  getUsers: () => API.get('/auth/users'),
};

// ======================== WEAPONS API ========================
export const weaponAPI = {
  getAll: () => API.get('/weapons'),
  getById: (id) => API.get(`/weapons/${id}`),
  search: (query) => API.get(`/weapons/search?query=${query}`),
  getByStatus: (status) => API.get(`/weapons/status/${status}`),
  getCategories: () => API.get('/weapons/categories'),
  create: (data) => API.post('/weapons', data),
  update: (id, data) => API.put(`/weapons/${id}`, data),
  delete: (id) => API.delete(`/weapons/${id}`),
};

// ======================== ASSIGNMENTS API ========================
export const assignmentAPI = {
  getAll: () => API.get('/assignments'),
  getById: (id) => API.get(`/assignments/${id}`),
  getByUser: (userId) => API.get(`/assignments/user/${userId}`),
  create: (data) => API.post('/assignments', data),
  update: (id, data) => API.put(`/assignments/${id}`, data),
  delete: (id) => API.delete(`/assignments/${id}`),
};

// ======================== MAINTENANCE API ========================
export const maintenanceAPI = {
  getAll: () => API.get('/maintenance'),
  getById: (id) => API.get(`/maintenance/${id}`),
  getByStatus: (status) => API.get(`/maintenance/status/${status}`),
  create: (data) => API.post('/maintenance', data),
  update: (id, data) => API.put(`/maintenance/${id}`, data),
  delete: (id) => API.delete(`/maintenance/${id}`),
};

// ======================== AMMUNITION API ========================
export const ammoAPI = {
  getAll: () => API.get('/ammunition'),
  getById: (id) => API.get(`/ammunition/${id}`),
  getLowStock: () => API.get('/ammunition/low-stock'),
  create: (data) => API.post('/ammunition', data),
  update: (id, data) => API.put(`/ammunition/${id}`, data),
  delete: (id) => API.delete(`/ammunition/${id}`),
};

// ======================== MISSIONS API ========================
export const missionAPI = {
  getAll: () => API.get('/missions'),
  getById: (id) => API.get(`/missions/${id}`),
  create: (data) => API.post('/missions', data),
  update: (id, data) => API.put(`/missions/${id}`, data),
};

// ======================== DASHBOARD API ========================
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

// ======================== AUDIT API ========================
export const auditAPI = {
  getAll: () => API.get('/audit'),
  getRecent: (count = 20) => API.get(`/audit/recent?count=${count}`),
  getByEntity: (type) => API.get(`/audit/entity/${type}`),
};

// ======================== REPORTS API ========================
export const reportAPI = {
  generatePDF: () => API.get('/reports/generate', { responseType: 'blob' }),
};

export default API;
