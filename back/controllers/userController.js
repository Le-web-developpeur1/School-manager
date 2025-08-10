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
        console.error("Erreur lors de l'ajout de l'utilisateur :", err);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message,
        });
    }
};

exports.getUser = async (req, res) => {
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

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const majData = req.body;
  
    try {
      const utilisateurModifie = await User.findByIdAndUpdate(id, majData, {
        new: true,
        runValidators: true,
      });
  
      if (!utilisateurModifie) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Utilisateur modifié avec succès !",
        utilisateur: utilisateurModifie,
      });
    } catch (err) {
      console.error("Erreur modification utilisateur:", err.message);
  
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        erreur: err.message,
      });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const utilisateur = await User.findByIdAndDelete(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Utilisateur suppirmé avec succès !"
        });
    } catch (error) {
        console.error("Erreur suppression :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

exports.toogleActivation = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ success: false, message:"Utilisateur introuvable" });

        user.actif = !user.actif;
        await user.save();

        res.status(200).json({ success: true, message: "État mis à jour avec succès !", user});
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur changement état", erreur: error.message });
    }
};