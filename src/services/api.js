import axios from 'axios';

const API_BASE_URL = 'https://netflixbackend.fademusics.com/api';
// For local development, uncomment the line below:
// const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieService = {
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  getMoviesByGenre: (genreId) => api.get(`/movies/genre/${genreId}`),
};

export const genreService = {
  getAllGenres: () => api.get('/genres'),
};

export const authService = {
  register: (email, password, confirmPassword, name) =>
    api.post('/auth/register', { email, password, confirmPassword, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  updatePlan: (planId) =>
    api.post('/auth/update-plan', { planId }),
  getUser: (id) =>
    api.get(`/auth/user/${id}`),
};

export const planService = {
  getAllPlans: () => api.get('/plans'),
  getPlanById: (id) => api.get(`/plans/${id}`),
  createPlan: (planData) => api.post('/plans', planData),
  updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export default api;
