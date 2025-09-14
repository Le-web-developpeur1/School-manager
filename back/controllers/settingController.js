const Settings = require('../models/settingsAdmin');
const SettingsComptable = require('../models/settingsComptable');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");

//Paramètres Admins
//Récupérer les paramètres
exports.getSettingsAdmin = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Paramètres non trouvés' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

//Mettre à jour les paramètres
exports.updateSettingsAdmin = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Paramètres non trouvés pour mise à jour' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Échec de la mise à jour', error: error.message });
  }
};


//----Paramètres Comptables----//
//Récupérer les paramètres
exports.getSettingsComptable = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const settings = await SettingsComptable.findOne({ user: userId });

    if (!settings) {
      settings = await SettingsComptable.create({ 
          user: userId, 
          formatExport: "PDF", 
          colonnesExport: ["Date", "Motif", "Montant", "Mode", "Statut"], 
          orientation: "Portrait", 
          nomFichier: "Releve_{nom}_{mois}_{annee}", 
          anneeScolaireActive: "2025-2026", 
          moisFiscalDepart: "Janvier", 
          periodeCloture: "Décembre", 
          notifications: { 
            alertesPaiement: true, 
            mailExport: false, 
            rappelCloture: false, 
          }, 
        });
    }

    return res.json(settings);
  } catch (error) {
    res.status(500).json({
      error: "Erreur chargement paramètres",
      details: error.message,
    });
  }
};


//Mettre à jour les paramètres
exports.updatedSettingsComptable = async (req, res) => {
  try {
    const updated = await SettingsComptable.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated)
  } catch (error) {
    
  }
};

exports.getProfil = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(userId).select("nom prenom email role lastLogin");
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur chargement profil", erreur: error.message });
  }
};

exports.updateProfil = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { nom, prenom, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { nom, prenom, email },
      { new: true }
    ).select("nom prenom email role");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour profil", details: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    const user = await User.findById(userId);
    const match = await bcrypt.compare(ancienMotDePasse, user.password);
    if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });

    user.password = await bcrypt.hash(nouveauMotDePasse, 10);
    await user.save();
    res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour mot de passe", details: err.message });
  }
};
