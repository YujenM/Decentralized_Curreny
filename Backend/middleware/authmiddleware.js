const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('auth-token');
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization token missing" });
    }

    try {
        const data = jwt.verify(authHeader, JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        console.error("Token verification failed: ", err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired, please login again" });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token, please provide a valid token" });
        } else {
            return res.status(500).json({ error: "Internal server error during token validation" });
        }
    }
};

module.exports = authMiddleware;
