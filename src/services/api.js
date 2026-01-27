import axios from 'axios';

const API_BASE_URL = 'https://netflixbackend.fademusics.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieService = {
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  getMoviesByGenre: (genreId) => api.get(`/movies/genre/${genreId}`),
};

export const genreService = {
  getAllGenres: () => api.get('/genres'),
};

export default api;
