import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard/MovieCard.js'; 
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    platform: '',
    synopsis: '',
  });
  const token = localStorage.getItem('token'); // Check if user is logged in via token
  let userId = null;
  let decoded = null;

  if (token) {
    try {
      const decoded = token ? jwtDecode(token) : null;
      userId = decoded.id; // assuming your token payload has 'id'
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  const fetchPoster = async (title) => {
    try {
      const res = await fetch(`http://localhost:5000/api/poster?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      return data.posterUrl;
    } catch (err) {
      console.error('Poster fetch error:', err);
      return '/placeholder-poster.png';
    }
  };
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/movies");
        const data = await res.json();

        // fetch posters in parallel
        const moviesWithPosters = await Promise.all(
          data.map(async (movie) => {
            console.log(await fetchPoster(movie.title));
            const posterUrl = await fetchPoster(movie.title);
            return { ...movie, posterUrl };
          })
        );
        
        setMovies(moviesWithPosters);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };

    fetchMovies();
  }, []);
  
  const handleAddMovie = async () => {
    if (!token) {
      alert('You must be logged in to add a movie');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newMovie.title,
          genre: newMovie.genre,
          platform: newMovie.platform,
          synopsis: newMovie.synopsis,
        }),
      });

      const data = await res.json();

      // fetch poster for the new movie
      const posterUrl = await fetchPoster(data.title);
      const movieWithPoster = { ...data, posterUrl };

      setMovies([...movies, movieWithPoster]);
      setNewMovie({ title: '', genre: '', platform: '', synopsis: '' });
    } catch (err) {
      console.error('Add movie error:', err);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!token) {
      alert('You must be logged in to delete a movie');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/movies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Delete failed:', data.error);
        alert('Delete failed: ' + data.error);
        return;
      }

      // Delete succeeded, update UI
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error('Delete movie error:', err);
    }
  };

  const handleUpdateMovie = async (id) => {
    const updatedTitle = prompt('Enter new title:');
    if (!updatedTitle) return;

    try {
      const res = await fetch(`http://localhost:5000/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: updatedTitle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update movie');
      }
      const updated = await res.json();
      setMovies(
        movies.map((movie) => (movie.id === id ? { ...movie, title: updated.title } : movie))
      );
    } catch (err) {
      console.error('Update movie error:', err);
    }
  };
  
  const handleThumbsUp = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/movies/${id}/thumbs-up`, {
        method: 'POST',
      });
      const data = await res.json();
      setMovies(
        movies.map((movie) => (movie.id === id ? { ...movie, thumbs_up: data.movie.thumbs_up } : movie))
      );
    } catch (err) {
      console.error('Thumbs up error:', err);
    }
  };

  const handleThumbsDown = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/movies/${id}/thumbs-down`, {
        method: 'POST',
      });
      const data = await res.json();
      setMovies(
        movies.map((movie) => (movie.id === id ? { ...movie, thumbs_down: data.movie.thumbs_down } : movie))
      );
    } catch (err) {
      console.error('Thumbs down error:', err);
    }
  };
  
  return (
    <div>
      <h2>Movie Dashboard 🎬</h2>
      
      {/* Add Movie Form (Only visible if logged in) */}
      {userId && (
        <div className="add-form">
          <h3>Add New Movie</h3>
          <input
            name="title"
            placeholder="Title"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          />
          <input
            name="genre"
            placeholder="Genre"
            value={newMovie.genre}
            onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
          />
          <input
            name="platform"
            placeholder="Platform"
            value={newMovie.platform}
            onChange={(e) => setNewMovie({ ...newMovie, platform: e.target.value })}
          />
          <input
            name="synopsis"
            placeholder="Synopsis"
            value={newMovie.synopsis}
            onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
          />
          <button onClick={handleAddMovie}>Add Movie</button>
        </div>
      )}

      {/* Show All Movies */}
      <div className="movie-list">
        <h3>All Movies</h3>
        {movies.length === 0 ? (
          <p>No movies available.</p>
        ) : (movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onThumbsUp={handleThumbsUp}
                onThumbsDown={handleThumbsDown}
                onEdit={handleUpdateMovie}
                onDelete={handleDeleteMovie}
                isOwner={decoded && decoded.id === movie.added_by}
              />
            ))
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;