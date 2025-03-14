import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // ✅ Hardcoded backend URL for local development

const api = axios.create({
  baseURL: API_URL, // ✅ Use direct URL instead of `import.meta.env.VITE_API_URL`
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const updateProfile = (data) => api.put('/auth/profile', data);
export const getProfile = () => api.get('/auth/profile');

// Tasks API
export const getTasks = () => api.get('/tasks');
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Plants API
export const getPlants = () => api.get('/plants');
export const createPlant = (plant) => api.post('/plants', plant);
export const updatePlant = (id, plant) => api.put(`/plants/${id}`, plant);
export const deletePlant = (id) => api.delete(`/plants/${id}`);

// Observations API
export const getObservations = () => api.get('/observations');
export const createObservation = (observation) => api.post('/observations', observation);
export const updateObservation = (id, observation) => api.put(`/observations/${id}`, observation);
export const deleteObservation = (id) => api.delete(`/observations/${id}`);

export default api;
