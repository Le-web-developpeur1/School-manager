// routes/initAdminRoute.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Route pour créer le premier admin (à supprimer après usage)
router.post('/init-admin', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password } = req.body;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin déjà existant' });
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = new User({
      nom,
      prenom,
      email,
      telephone,
      password: hash,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin créé avec succès', admin });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création', erreur: err.message });
  }
});

module.exports = router;
