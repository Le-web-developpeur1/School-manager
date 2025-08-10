const Settings = require('../models/settings');

// GET: récupérer les paramètres
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Paramètres non trouvés' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// PUT: mettre à jour les paramètres
exports.updateSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Échec de la mise à jour', error });
  }
};
