const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Unauthorized, token is required' });

    const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        req.user = decoded;
        next();
    });
};

module.exports = { authenticate };