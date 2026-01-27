import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, genreService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import '../styles/Home.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre);
    } else {
      fetchMovies();
    }
  }, [selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Make sure the backend is running on http://localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await genreService.getAllGenres();
      setGenres(response.data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchMoviesByGenre = async (genreId) => {
    try {
      setLoading(true);
      const response = await movieService.getMoviesByGenre(genreId);
      setMovies(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching movies by genre:', err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <img src="https://images.ctfassets.net/4cd45et68cgf/7LrExJ6PAj6MSIPkMYKD76/8981c922a25a1d38c45201b32408bb13/Netflix-logo.png" alt="Netflix" className="navbar-logo" style={{ height: '40px', objectFit: 'contain' }} />
        <div className="navbar-right">
          {user && <span className="user-name">Welcome, {user.name}</span>}
          {user?.plan && <span className="user-plan">Plan: {user.plan.name}</span>}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="genre-filter">
        <button
          className={`genre-btn ${!selectedGenre ? 'active' : ''}`}
          onClick={() => setSelectedGenre(null)}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <main className="movies-container">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No movies found</div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
