const Eleve = require('../models/Eleve');
const User = require('../models/User');
const Paiement = require('../models/Paiement');

exports.getStats = async (req, res) => {
    try {
        const totalEleves = await Eleve.countDocuments({archive: false});
        const totalEnseignants = await User.countDocuments({ role: 'enseignant' });
        
        const paiements = await Paiement.aggregate([
            {
                $group: {
                    _id: null,
                    montantTotal: { $sum: '$montant' }
                }
            }
        ]);

        const montantTotal = paiements[0]?.montantTotal || 0;

        res.status(200).json({
            totalEleves,
            totalEnseignants,
            montantTotal
        });
    } catch (error) {
        console.error('Erreur lors de chargement des statistiques', error);
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};

exports.getEncaissementsMensuels = async (req, res) => {
    try {

      const encaissements = await Paiement.aggregate([
        {
          $match: { 
            datePaiement: {
                $gte: new Date("2025-01-01"),
                $lte: new Date("2025-12-31")
            }
         }
        },
        {
          $group: {
            _id: { $month: "$datePaiement" },
            montant: { $sum: "$montant" }
          }
        },
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
      console.error("Erreur encaissements mensuels:", err);
      res.status(500).json({ message: "Erreur serveur" });
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