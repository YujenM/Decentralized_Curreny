const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('auth-token');
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    try {
        const data = jwt.verify(authHeader, JWT_SECRET);
        req.user = data;  
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;



