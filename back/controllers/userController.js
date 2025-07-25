const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
        const { nom, prenom, email, telephone, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Utilisateur déjà existant"
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            nom,
            prenom,
            email,
            telephone,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: newUser,
        });

    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur :", err);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message,
        });
    }
};

exports.listerUser = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du listing des utilisateurs !", error
        })
    }
};

exports.modifierUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        const majData = req.body;

        const utilisateurModifie = await User.findByIdAndUpdate(id, majData, {
            new: true,
            runValidators: true
        });

        if (!utilisateurModifie) {
            return res.status(404).json({success: false, message: "Utilisateur non trouvé" });
        } else {
            res.status(200).json({
                success: true,
                message: "Utilisateur modifié avec succès !",
                utilisateur: utilisateurModifie
            });
        }
    } catch (error) {
        console.error("Erreur lors de la modification de l'utilisateur", error);
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};
