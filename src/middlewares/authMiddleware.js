const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: 'Accès non autorisé, token manquant' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;

        console.log("Utilisateur authentifié :", req.user); // 🔥 DEBUG pour voir si `role` est bien lu

        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token invalide' });
    }
};
