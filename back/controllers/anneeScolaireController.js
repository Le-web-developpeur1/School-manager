const AnneeScolaire = require("../models/AnneeScolaire");

exports.creerAnneeScolaire = async (req, res) => {
    try {
      const { libelle, debut, fin } = req.body;
  
      // Vérifie si une année avec le même libellé existe déjà
      const existe = await AnneeScolaire.findOne({ libelle });
      if (existe) {
        return res.status(400).json({ success: false, message: "Cette année scolaire existe déjà." });
      }
  
      const annee = await AnneeScolaire.create({ libelle, debut, fin });
      res.status(201).json({ success: true, message: "Année scolaire enregistrée", annee });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur enregistrement", erreur: error.message });
    }
};


exports.activerAnneeScolaire = async (req, res) => {
  try {
    await AnneeScolaire.updateMany({}, { active: false }); // désactive toutes
    await AnneeScolaire.findByIdAndUpdate(req.params.id, { active: true }); // active celle choisie
    res.json({ success: true, message: "Année scolaire activée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur activation", erreur: error.message });
  }
};
