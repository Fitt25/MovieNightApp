// Importing the jwt library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to authenticate the user based on the JWT token
const authenticateUser = (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    // If the header doesn't exist or doesn't start with 'Bearer ', return an error (403 - Forbidden)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Access denied, invalid token format." });
    }

    // Extract the token by splitting the header
    const token = authHeader.split(" ")[1];

    // If no token is provided after 'Bearer', return an error (403 - Forbidden)
    if(!token){
        return res.status(403).json({ error: "Access denied, no token provided." });
    }

    try {
        // Verify the token with the secret from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user data to the request object for further use
        req.user = decoded;

        // Move on to the next middleware or route handler if token is valid
        next();
    }catch (err) {
        // If the token is invalid or expired, return an error (400 - Bad Request)
        return res.status(400).json({ error: "Invalid token." });
    }
};

// Export the authenticateUser middleware so it can be used in other parts of the app
module.exports = authenticateUser;
