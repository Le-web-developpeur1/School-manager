const Eleve = require('../models/Eleve');
const User = require('../models/User');
const Paiement = require('../models/Paiement');
const mongoose = require('mongoose');

exports.getStats = async (req, res) => {
    try {
        // Stats globales sur les élèves et enseignants
        const totalEleves = await Eleve.countDocuments({ archive: false });
        const totalEnseignants = await User.countDocuments({ role: 'enseignant' });

        // Filtre de base pour les paiements
        const filtrePaiement = { statut: { $ne: 'Annulé' } };

        // 🔒 Si c'est un comptable, on filtre par son ID
        if (req.user.role === 'comptable') {
            filtrePaiement.comptable = new mongoose.Types.ObjectId(req.user.id)
        }

        // Total encaissé
        const totalEncaisséAgg = await Paiement.aggregate([
            { $match: filtrePaiement },
            { $group: { _id: null, total: { $sum: "$montant" } } }
        ]);
        const montantTotal = totalEncaisséAgg[0]?.total || 0;

        // Encaissement du mois en cours
        const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const encaissementMoisAgg = await Paiement.aggregate([
            { $match: { ...filtrePaiement, datePaiement: { $gte: debutMois } } },
            { $group: { _id: null, total: { $sum: "$montant" } } }
        ]);
        const encaissementMois = encaissementMoisAgg[0]?.total || 0;

        // Nombre de paiements
        const nombrePaiements = await Paiement.countDocuments(filtrePaiement);

        // Répartition par motif
        const repartitionMotif = await Paiement.aggregate([
            { $match: filtrePaiement },
            { $group: { _id: "$motif", total: { $sum: "$montant" } } }
        ]);

        res.status(200).json({
            totalEleves,
            totalEnseignants,
            montantTotal,
            encaissementMois,
            nombrePaiements,
            repartitionMotif
        });

    } catch (error) {
        console.error('Erreur lors du chargement des statistiques', error);
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};


exports.getEncaissementsMensuels = async (req, res) => {
    try {
        const filtre = { statut: { $ne: 'Annulé' } };

        if (req.user.role === 'comptable') {
            filtre.comptable = new mongoose.Types.ObjectId(req.user.id);;
        }

        const encaissements = await Paiement.aggregate([
            { $match: { 
                ...filtre,
                datePaiement: {
                    $gte: new Date("2025-01-01"),
                    $lte: new Date("2025-12-31")
                }
            }},
            { $group: {
                _id: { $month: "$datePaiement" },
                montant: { $sum: "$montant" }
            }},
            { $sort: { _id: 1 } }
        ]);

        const moisLabels = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];

        const resultArray = moisLabels.map((mois, index) => {
            const found = encaissements.find(({ _id }) => _id === index + 1);
            return { mois, montant: found ? found.montant : 0 };
        });
        
        console.log("Encaissements mensuels:", resultArray);
        res.status(200).json(resultArray);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
};

  

exports.getRepartitionParNiveau = async (req, res) => {
    try {
        const niveaux = ['Maternelle', 'Primaire', 'Collège', 'Lycée'];

        const result = {};
        for(const niveau of niveaux) {
            const count = await Eleve.countDocuments({ niveau, archive: false });
            result[niveau] = count;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur repartition par niveau :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getRatioElevesEnseignants = async (req, res) => {
    try {
        const totalEleves = await Eleve.countDocuments({ archive: false });
        const totalEnseignants = await User.countDocuments({ role: 'enseignant' });

        res.status(200).json({ 
            Eleves: totalEleves,
            Enseignants: totalEnseignants
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getRepartitionSexe = async (req, res) => {
    try {
        const filles = await Eleve.countDocuments({ sexe: "Feminin", archive: false });
        const garcons = await Eleve.countDocuments({ sexe: "Masculin", archive: false });

        res.status(200).json({
            Filles: filles,
            Garcons: garcons
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.repartitionMotif = async (req, res) => {
    try {
      const filtre = { statut: { $ne: 'Annulé' } };
  
      if (req.user.role === 'comptable') {
        filtre.comptable = new mongoose.Types.ObjectId(req.user.id);
      }
  
      const repartition = await Paiement.aggregate([
        { $match: filtre },
        {
          $group: {
            _id: "$motif",
            montant: { $sum: "$montant" }
          }
        },
        { $sort: { montant: -1 } }
      ]);
  
      // Formatage pour le front
      const result = repartition.map(r => ({
        motif: r._id,
        montant: r.montant
      }));
  
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur stats motifs", erreur: error.message });
    }
  };
  
