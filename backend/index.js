// Importing necessary dependencies
const express = require('express'); // Express is a web framework for Node.js, used for routing and handling HTTP requests
const cors = require('cors'); // CORS middleware to handle cross-origin requests
const authenticateUser = require('./middleware/auth'); // Custom authentication middleware for securing routes
const moviesController = require('./controllers/moviesController'); // Movie-related controller to handle movie operations
const usersController = require('./controllers/usersController'); // User-related controller to handle user operations
require('dotenv').config(); // Loads environment variables from a .env file for sensitive info like DB credentials

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS to allow cross-origin requests, making the API accessible from different domains
app.use(express.json()); // Automatically parses incoming requests with JSON payloads into JavaScript objects


// Routes

// User registration endpoint: handles POST requests to /register, triggers userRegistration method from usersController
app.post('/register', usersController.userRegistration);

// User login endpoint: handles POST requests to /login, triggers userLogin method from usersController
app.post('/login', usersController.userLogin);

// Get all movies endpoint: handles GET requests to /movies, triggers getMovies method from moviesController
app.get('/movies', moviesController.getMovies);
// Get all movie posters through the API
app.get('/api/poster', moviesController.getMoviePoster);
// Add a new movie endpoint: handles POST requests to /movies, requires authentication via authenticateUser middleware, 
// triggers addNewMovie method from moviesController
app.post('/movies', authenticateUser, moviesController.addNewMovie);

// Update an existing movie endpoint: handles PUT requests to /movies/:id, requires authentication via authenticateUser middleware,
// triggers updateMovie method from moviesController
app.put('/movies/:id', authenticateUser, moviesController.updateMovie);

// Delete a movie endpoint: handles DELETE requests to /movies/:id, requires authentication via authenticateUser middleware,
// triggers deleteMovie method from moviesController
app.delete('/movies/:id', authenticateUser, moviesController.deleteMovie);

app.post('/movies/:id/thumbs-up', authenticateUser, moviesController.givesThumbsUp);
app.post('/movies/:id/thumbs-down', authenticateUser, moviesController.givesThumbsDown);
// Port setup
const PORT = process.env.PORT || 5000; // Sets the port for the server, default to 5000 if not defined in .env

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Logs a message when the server starts, so we know it's running and which port it's on
});