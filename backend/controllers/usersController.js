// Importing necessary dependencies for Supabase, password hashing, and JWT generation
const supabase = require('../db/supabaseClient'); // To interact with Supabase database
const bcrypt = require('bcryptjs'); // To hash passwords securely
const jwt = require('jsonwebtoken'); // To generate JWT tokens for user authentication
const validator = require('validator'); // To validate email formatting

// User login: validates credentials and returns a JWT token
exports.userLogin = async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request body

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
        // Check if a user exists with the provided email
        const { data: user, error } = await supabase
        .from('users')
        .select('*') // Select all fields
        .eq('email', email) // Find the user by email
        .single(); // Expecting a single user result

        // If no user is found or there's an error, return 401 (unauthorized)
        if(error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match, return 401 (unauthorized)
        if(!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token with the user's ID, this token will be used for authenticating future requests
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

        // Send the token back to the user
        res.json({ token });
    
    } catch(err) {
        // If there's an error, return a 500 status with the error message
        res.status(500).json({ error: err.message });
    }
}

// User registration: registers a new user, hashes their password, and returns a JWT token
exports.userRegistration = async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request body
    
    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
        // Check if the email is already taken by an existing user
        const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email) // Match email in the database
        .single(); // Expecting a single result

        // If the user already exists, return a 400 error
        if(existingUser) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const { data, error: insertError } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword }])
        .select(); // Select the inserted data

        // If there's an error during insertion, throw it
        if (insertError) throw insertError;

        // Generate a JWT token for the new user
        const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Send the token as the response to the user
        res.status(201).json({ token });

    } catch(err) {
        console.error('Registration error:', err);
        // If there's any error, return it with a 500 status
        res.status(500).json({ error: err.message });
    }
}