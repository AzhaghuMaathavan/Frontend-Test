import { useState } from 'react';
import '../styles/MovieDetails.css';

export default function MovieDetails({ movie, onClose }) {
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    let videoId = url;
    
    // Extract video ID from embed/ URLs (YouTube embed format)
    if (url.includes('embed/')) {
      videoId = url.split('embed/')[1];
    }
    // If url already starts with https://tube.rvere.com, extract the video ID
    else if (url.includes('tube.rvere.com')) {
      videoId = url.split('v=')[1];
    }
    // Extract video ID from YouTube watch URLs (v= format)
    else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    // Extract video ID from youtu.be short URLs
    else if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    console.log('getEmbedUrl - Original:', url, 'VideoID:', videoId);
    // Use tube.rvere.com embed with correct format
    return `https://tube.rvere.com/embed?v=${videoId}`;
  };

  const videoUrl = movie.videoUrl || '';
  const embedUrl = getEmbedUrl(videoUrl);
  console.log('MovieDetails - videoUrl:', videoUrl, 'embedUrl:', embedUrl);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="movie-details-container">
          <h1>{movie.title}</h1>
          
          {embedUrl ? (
            <div className="video-container">
              <div style={{ height: '0px', overflow: 'hidden', paddingTop: '56.25%', position: 'relative', width: '100%' }}>
                <iframe
                  style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="no-trailer">
              <p>Trailer not available</p>
            </div>
          )}

          <div className="movie-info-section">
            <div className="info-row">
              <span className="label">Release Year:</span>
              <span className="value">{movie.releaseDate || 'N/A'}</span>
            </div>
            
            {movie.genre && (
              <div className="info-row">
                <span className="label">Genre:</span>
                <span className="value">{movie.genre.name}</span>
              </div>
            )}
            
            {movie.rating && (
              <div className="info-row">
                <span className="label">Rating:</span>
                <span className="value">⭐ {movie.rating}</span>
              </div>
            )}

            {movie.duration && (
              <div className="info-row">
                <span className="label">Duration:</span>
                <span className="value">{movie.duration} minutes</span>
              </div>
            )}

            {movie.description && (
              <div className="info-row">
                <span className="label">Description:</span>
                <span className="value description">{movie.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
