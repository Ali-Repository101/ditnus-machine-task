const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ msg: 'No token, auth denied' });

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
