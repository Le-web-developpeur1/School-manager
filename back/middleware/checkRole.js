module.exports = function (rolesAutorises) {
    return (req, res, next) => {
        const utilisateur = req.user;

        if(!utilisateur || !rolesAutorises.includes(utilisateur.role)) {
            return res.status(403).json({ message: "Accès refusé - rôle non autorisé" });
        }

        next();
    };
};