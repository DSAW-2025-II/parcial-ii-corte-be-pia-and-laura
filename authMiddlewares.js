const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(403).json({ error: 'User not authenticated'});
        }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token',});
        }
        req.user = user;
        next();
    });
};
module.exports = verifyToken;