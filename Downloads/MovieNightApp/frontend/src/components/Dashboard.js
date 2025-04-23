import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    platform: '',
    synopsis: '',
  });
  const token = localStorage.getItem('token'); // Check if user is logged in via token

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:5000/movies');
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
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
      setMovies([...movies, data]);
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
      await fetch(`http://localhost:5000/movies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const updated = await res.json();
      setMovies(
        movies.map((movie) => (movie.id === id ? { ...movie, title: updated.title } : movie))
      );
    } catch (err) {
      console.error('Update movie error:', err);
    }
  };

  return (
    <div>
      <h2>Movie Dashboard 🎬</h2>

      {/* Add Movie Form (Only visible if logged in) */}
      {token && (
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
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h4>{movie.title}</h4>
              <p><strong>Genre:</strong> {movie.genre || 'N/A'}</p>
              <p><strong>Platform:</strong> {movie.platform || 'N/A'}</p>
              <p><strong>Synopsis:</strong> {movie.synopsis || 'N/A'}</p>
              <p><strong>Created At:</strong> {new Date(movie.created_at).toLocaleString()}</p>
              <p><strong>Thumbs Up:</strong> {movie.thumbs_up}</p>
              <p><strong>Thumbs Down:</strong> {movie.thumbs_down}</p>

              {/* Show Edit/Delete options only if logged in */}
              {token && (
                <div className="movie-actions">
                  <button onClick={() => handleUpdateMovie(movie.id)}>Update</button>
                  <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;