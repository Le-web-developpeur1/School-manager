const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé !'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe incorrect'
            });
        }
        const token = jwt.sign({id: user._id, role: user.role, actif: user.actif}, process.env.SECRET_KEY, { expiresIn: "24h" });
        res.status(200).json({
            success: true,
            message: 'Connexion réussie !',
            token,
            utilisateur: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                actif: user.actif,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur', error})
    }
}