const Paiement = require('../models/Paiement');

exports.creerPaiement = async (req, res) => {
    try {
        const { eleve, montant, motif } = req.body;
        const comptable = req.user.id;
        const paiement = new Paiement({ eleve, montant, motif, comptable });
        await paiement.save();
        res.status(201).json(paiement);
    } catch (error) {
        res.status(500).json({ message: "Erreur d'ajout paiement", error})
    }
};

exports.listerPaiements = async (req, res) => {
    try {
        const paiements = await Paiement.find().populate('eleve').populate('comptable', 'nom prenom');
        res.status(200).json(paiements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des paiements", error});
    }
};