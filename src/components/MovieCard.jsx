import '../styles/MovieCard.css';

export default function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="movie-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className="no-poster">No Image</div>
        )}
        <div className="movie-overlay">
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p className="rating">⭐ {movie.rating || 'N/A'}</p>
            {movie.genre && <p className="genre">{movie.genre.name}</p>}
            <p className="click-hint">Click to watch trailer</p>
          </div>
        </div>
      </div>
      <div className="movie-details">
        <h4>{movie.title}</h4>
        <p className="year">{movie.releaseYear}</p>
      </div>
    </div>
  );
}
