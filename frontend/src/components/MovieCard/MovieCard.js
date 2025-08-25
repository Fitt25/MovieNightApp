import React, { useState } from 'react';
import './MovieCard.css';

const MovieCard = ({ movie, onThumbsUp, onThumbsDown, onEdit, onDelete, isOwner }) => {
  const [hovered, setHovered] = useState(false);

  if(!movie) return null
  const synopsis = movie.synopsis || "";
  const shortSynopsis = synopsis.length > 100
    ? synopsis.substring(0, 100) + '...'
    : synopsis;

  return (
    <div
      className={`movie-card ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="movie-poster">
        {/* Placeholder image now, later AI poster */}
        <img src={movie.posterUrl || "/placeholder-poster.png"} alt={movie.title} />
      </div>

      <div className="movie-info">
        <h4>{movie.title}</h4>
        <p><strong>Platform:</strong> {movie.platform?.join(', ') || 'N/A'}</p>
        <p><strong>Synopsis:</strong> {hovered ? movie.synopsis : shortSynopsis}</p>
        <div className="thumbs">
          <button onClick={() => onThumbsUp(movie.id)}>👍 {movie.thumbs_up}</button>
          <button onClick={() => onThumbsDown(movie.id)}>👎 {movie.thumbs_down}</button>
        </div>

        {/*hovered && (*/
          <>
            <p><strong>Created At:</strong> {new Date(movie.created_at).toLocaleString()}</p>
            {isOwner && (
              <div className="movie-actions">
                <button onClick={() => onEdit(movie.id)}>Edit</button>
                <button onClick={() => onDelete(movie.id)}>Delete</button>
              </div>
            )}
          </>
        /*)*/}
      </div>
    </div>
  );
};

export default MovieCard;