const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token manquant' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        //Mise à jour de la dernière connexion
        await User.findByIdAndUpdate(decoded.id, {lastLogin: new Date() });
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};