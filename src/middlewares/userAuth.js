const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, 'sith@133732gdgdhus', async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}

module.exports = userAuth;