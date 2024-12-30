const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    // Check if token exists and follows the 'Bearer <token>' format
    if (!token) return res.status(401).json({ message: 'Unauthorized, token is required' });

    // Remove 'Bearer ' prefix from the token if present
    const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        // Attach the decoded user data to the request object
        req.user = decoded;
        next();
    });
};

module.exports = { authenticate };