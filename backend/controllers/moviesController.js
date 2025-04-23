// Importing Supabase client and other dependencies
const supabase = require('../db/supabaseClient'); // To interact with Supabase database
const bcrypt = require('bcryptjs'); // Used for hashing passwords
const jwt = require('jsonwebtoken'); // Used to generate JSON Web Tokens for authentication

// Get all movies: fetches and returns a list of all movies in the database
exports.getMovies = async (req, res) => {
    try {
        // Fetch all movies from the 'movies' table
        const { data, error } = await supabase
        .from('movies')
        .select('*'); // Select all columns

        // If there's an error fetching the movies, throw it
        if (error) throw error;

        // Return the movies data as a response
        res.status(200).json(data);

    } catch(err) {
        // Catch any error and return a response
        res.status(500).json({ error: err.message });
    }
}

// Add a new movie: adds a new movie to the database
exports.addNewMovie = async (req, res) => {
    const { title, genre, platform, synopsis } = req.body; // Get movie data from the body
    const userId = req.user.id; // Get the user ID from the authenticated user

    // Ensure platform is always an array
    const platformArray = Array.isArray(platform) ? platform : [platform]; 

    try {
        // Insert the new movie into the 'movies' table
        const { data, error } = await supabase
        .from('movies')
        .insert([{ title, genre, platform: platformArray, synopsis, added_by: userId }])
        .select(); // Select the inserted data
        
        // If there's an error during insertion, throw it
        if (error) throw error;

        // Return the newly added movie data as a response
        res.status(201).json(data);

    } catch(err) {
        // Catch any error and send a response
        res.status(500).json({ error: err.message });
    }
}

// Update a movie: updates a movie's details based on its ID
exports.updateMovie = async (req, res) => {
    const { id } = req.params; // Get the movie ID from the URL params
    const userId = req.user.id; // Get the user ID from the authenticated user
    const { title, genre, platform, synopsis } = req.body; // Get the updated movie data from the body

    // Ensure platform is always an array
    const platformArray = Array.isArray(platform) ? platform : [platform]; 

    try {
        // Fetch the movie from the database to check if the user is allowed to update it
        const { data: movie, error: fetchError } = await supabase
        .from('movies')
        .select('added_by') // We only need to check the 'added_by' field to see if the user is the one who added the movie
        .eq('id', id) // Find the movie by its ID
        .single(); // Expect a single result

        // If there's an error or the movie isn't found, throw an error
        if (fetchError) throw fetchError;

        // If the movie wasn't added by the authenticated user, reject the request
        if(movie.added_by !== userId){
            return res.status(500).json({ error: "You are not authorized to update this movie." });
        }

        // Update the movie in the database
        const { data, error } = await supabase
        .from('movies')
        .update({ title, genre, platform: platformArray, synopsis }) // Update the movie's details
        .eq('id', id); // Find the movie by its ID
        
        // If there's an error during the update, throw it
        if (error) throw error;

        // Return the updated movie data as a response
        res.status(200).json(data);

    } catch(err) {
        // Catch any error and send a response
        res.status(500).json({ error: err.message });
    }
}

// Delete a movie: deletes a movie from the database based on its ID
exports.deleteMovie = async (req, res) => {
    const { id } = req.params; // Get the movie ID from the URL params
    const userId = req.user.id; // Get the user ID from the authenticated user

    try {
        // Fetch the movie from the database to check if the user is allowed to delete it
        const { data: movie, error: fetchError } = await supabase
        .from('movies')
        .select('added_by') // We only need to check the 'added_by' field to see if the user is the one who added the movie
        .eq('id', id) // Find the movie by its ID
        .single(); // Expect a single result

        // If there's an error or the movie isn't found, throw an error
        if (fetchError) throw fetchError;

        // If the movie wasn't added by the authenticated user, reject the request
        if(movie.added_by !== userId){
            return res.status(500).json({ error: "You are not authorized to delete this movie." });
        }

        // Delete the movie from the database
        const { data, error } = await supabase
        .from('movies')
        .delete() // Delete the movie
        .eq('id', id); // Find the movie by its ID

        // If there's an error during deletion, throw it
        if (error) throw error;

        // Return the deleted movie data as a response
        res.status(200).json(data);

    } catch(err) {
        // Catch any error and send a response
        res.status(500).json({ error: err.message });
    }
}

exports.givesThumbsUp = async (req,res) => {
    const {id} = req.params;
    try{
        const { data: movie, error: fetchError } = await supabase
        .from('movies')
        .select('thumbs_up')
        .eq('id', id)
        .single();

        if (fetchError || !movie) {
            return res.status(404).json({ error: "Movie not found." });
        }

        const newThumbsUp = (movie.thumbs_up || 0) + 1;
        const { data, error} = await supabase
        .from('movies')
        .update({ thumbs_up: newThumbsUp })
        .eq('id', id)
        .select()

        if (error) throw error;

        res.json({ message: 'Thumbs up added!', movie: data[0]});
    }catch(err) {
        res.status(500).json({ error: err.message});
    }
}

exports.givesThumbsDown = async (req,res) => {
    const {id} = req.params;
     try{
        const { data: movie, error: fetchError } = await supabase
        .from('movies')
        .select('thumbs_down')
        .eq('id', id)
        .single();

        if (fetchError || !movie) {
            return res.status(404).json({ error: "Movie not found." });
        }

        const newThumbsDown = (movie.thumbs_down || 0) + 1;
        const { data, error} = await supabase
        .from('movies')
        .update({ thumbs_down: newThumbsDown })
        .eq('id', id)
        .select()

        if (error) throw error;
        
        res.json({ message: 'Thumbs down added!', movie: data[0]});
    }catch(err) {
        res.status(500).json({ error: err.message});
    }
}