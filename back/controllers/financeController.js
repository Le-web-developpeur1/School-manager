const mongoose = require('mongoose');
const Eleve = require('../models/Eleve');
const Paiement = require('../models/Paiement');
const { genererReferencePaiement } = require('../services/referenceService');
const { getPaiementEnums } = require('../utils/paiementEnums');
const { genereRecuPDF } = require("../utils/pdfRecu");

exports.creerPaiement = async (req, res) => {
    try {
        const { eleve, montant, motif, datePaiement, anneeScolaire, mois, periode, payeur, justificatifUrl, verifie, modePaiement } = req.body;
        const comptable = new mongoose.Types.ObjectId(req.user.id);

        const eleveExiste = await Eleve.findById(eleve);
        if (!eleveExiste) {
            return res.status(404).json({ success: false, message:"Élève introuvable" });
        };

        const paiementExiste = await Paiement.findOne({
            eleve, mois, motif, anneeScolaire
        });

        if (paiementExiste) {
            return res.status(400).json({ success: false, message: "Un paiement pour ce mois et ce motif existe déjà pour cet élève." });
        };

        const reference = genererReferencePaiement();

        const paiement = await Paiement.create({ 
            eleve, montant, mois, periode, datePaiement, 
            motif, anneeScolaire, comptable, reference,
            payeur, justificatifUrl, verifie, modePaiement
        });

        await paiement.populate("eleve", "nom prenom classe matricule");
        await paiement.populate("comptable", "nom prenom");

        try {
            return genereRecuPDF(paiement, res); // ✅ pipe vers la réponse
          } catch (err) {
            console.error("Erreur PDF:", err);
            return res.status(500).send("Erreur serveur : PDF non généré.");
          }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur d'ajout paiement", erreur: error.message });
    }
};

exports.listerPaiements = async (req, res) => {
    try {
       const filtre = { 
            ...req.filtreComptable ,
            ...(req.query.eleve && { eleve: req.query.eleve }),
            ...(req.query.anneeScolaire && { anneeScolaire: req.query.anneeScolaire })
        };

        // Filtre du jour
        if (req.query.jour) {
        const today = new Date();
            today.setHours(0, 0, 0, 0);
            filtre.datePaiement = { $gte: today };
        }
  
      // Filtre de la semaine
        if (req.query.semaine) {
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // dimanche
            startOfWeek.setHours(0, 0, 0, 0);
            filtre.datePaiement = { $gte: startOfWeek };
        }

        const total = await Paiement.countDocuments(filtre);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const paiements = await Paiement.find(filtre)
            .populate('eleve', 'nom prenom matricule')
            .populate('comptable', 'nom prenom')
            .sort({datePaiement: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ success: true, page, total, paiements });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des paiements", erreur: error.message });
    }
};

exports.releveEleve = async (req, res) => {
    try {
        const { eleveId } = req.params;
        const { anneeScolaire } = req.query;

        // Filtre de base
        const filtre = { eleve: eleveId };

        // Si une année scolaire est précisée
        if (anneeScolaire) {
            filtre.anneeScolaire = anneeScolaire;
        }

        // Si l'utilisateur est un comptable, on filtre aussi par son ID
        if (req.user.role === 'comptable') {
            filtre.comptable = req.user.id;
        }

        // Récupération des paiements
        const paiements = await Paiement.find(filtre)
            .populate('comptable', 'nom prenom')
            .sort({ datePaiement: 1 });

        // Infos de l'élève
        const eleveInfo = await Eleve.findById(eleveId, 'nom prenom matricule');

        // Total encaissé
        const total = paiements.reduce((acc, p) => acc + p.montant, 0);

        res.status(200).json({
            success: true,
            eleve: eleveInfo,
            anneeScolaire: anneeScolaire || 'toutes',
            total,
            paiements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};


exports.totalParClasse = async (req, res) => {
    try {
        const { classeId } = req.params;
        const { anneeScolaire, mois, annee } = req.query;

        // Récupération des élèves de la classe
        const eleveDeLaClasse = await Eleve.find({ classe: classeId }, '_id');
        const idEleves = eleveDeLaClasse.map(e => e._id);

        // Construction du filtre
        const filtrePaiement = { eleve: { $in: idEleves } };

        // 🔒 Filtre par comptable si rôle = comptable
        if (req.user.role === 'comptable') {
            filtrePaiement.comptable = req.user.id;
        }

        // Filtre par année scolaire
        if (anneeScolaire) {
            filtrePaiement.anneeScolaire = anneeScolaire;
        }

        // Filtre mensuel si mois + année
        if (mois && annee) {
            const debut = new Date(annee, mois - 1, 1);
            const fin = new Date(annee, mois, 1);
            filtrePaiement.datePaiement = { $gte: debut, $lt: fin };
        }

        // Récupération des paiements
        const paiements = await Paiement.find(filtrePaiement);

        // Total encaissé
        const total = paiements.reduce((acc, p) => acc + p.montant, 0);

        // Répartition par motif
        const breakdown = {};
        paiements.forEach(p => {
            breakdown[p.motif] = (breakdown[p.motif] || 0) + p.montant;
        });

        res.status(200).json({
            success: true,
            classe: classeId,
            anneeScolaire: anneeScolaire || 'toutes',
            mois: mois || 'tous',
            annee: annee || 'toutes',
            total,
            nombrePaiements: paiements.length,
            breakdown
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

exports.rechercherEleve = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: "Requête vide" });
        }

        const regex = new RegExp(q, 'i');

        const resultats = await Eleve.find({
            $or: [
                { nom: regex },
                { prenom: regex },
                { matricule: regex }
            ]
        }).limit(20);

        res.status(200).json({ success: true, resultats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la recherche", erreur: error.message });
    }
};

exports.updatePaiement = async (req, res) => {
    try {
        const { id } = req.params;
        const { montant, motif, datePaiement, mois, periode, payeur, justificatifUrl, verifie, modePaiement } = req.body;

        // Vérifier si le paiement existe
        const paiement = await Paiement.findById(id);
        if (!paiement) {
            return res.status(404).json({ success: false, message: "Paiement introuvable" });
        };

        // Si c'est un comptable, il ne peut modifier que ses paiements
        if (req.user.role === 'comptable' && paiement.comptable.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Accès refusé" });
        };

        // Mise à jour des champs
        if (montant !== undefined) paiement.montant = montant;
        if (motif) paiement.motif = motif;
        if (datePaiement) paiement.datePaiement = datePaiement;
        if (mois) paiement.mois = mois;
        if (periode) paiement.periode = periode;
        if (payeur) paiement.payeur = payeur;
        if (justificatifUrl) paiement.justificatifUrl = justificatifUrl;
        if (verifie !== undefined) paiement.verifie = verifie;
        if (modePaiement) paiement.modePaiement = modePaiement;

        await paiement.save();

        res.status(200).json({ success: true, message: "Paiement mis à jour avec succès", paiement });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du paiement", erreur: error.message });    
    }
};

exports.annulerPaiement = async (req, res) => {
    try {
        const { id } = req.params;

        const paiement = await Paiement.findById(id);
        if (!paiement) {
            return res.status(404).json({ success: false, message: "Paiement introuvable" });
        }

        //Si c'est un comptable, il ne peut annuler que ses paiements
        if (req.user.role === 'comptable' && paiement.comptable.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Accès refusé" });
        }

        if (paiement.statut === "Annulé") {
            return res.status(400).json({
              success: false,
              message: "Ce paiement est déjà annulé"
            });
        }

        paiement.statut = 'Annulé';
        await paiement.save();

        res.status(200).json({ success: true, message: "Paiement annulé avec succès", paiement });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de l'annulation du paiement", erreur: error.message });
    }
};

exports.getImpayes = async (req, res) => {
    try {
      // Calcul dynamique de l'année scolaire
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // Janvier = 1
      let anneeScolaire;
  
      if (currentMonth >= 9) {
        // Septembre à Décembre → année scolaire commence cette année
        anneeScolaire = `${currentYear}-${currentYear + 1}`;
      } else {
        // Janvier à Août → année scolaire a commencé l'année précédente
        anneeScolaire = `${currentYear - 1}-${currentYear}`;
      }
  
      // Début et fin du mois actuel
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
      const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
      const filtrePaiements = {
        datePaiement: { $gte: debutMois, $lte: finMois },
        anneeScolaire,
        statut: { $ne: 'Annulé' }
      };
  
      // 📋 Tous les élèves
      const eleves = await Eleve.find();
  
      // 💰 Paiements du mois en cours
      const paiementsMois = await Paiement.find(filtrePaiements).select('eleve montant');
  
      const payesIds = paiementsMois.map(p => p.eleve.toString());
      const impayes = eleves.filter(e => !payesIds.includes(e._id.toString()));
  
      res.status(200).json({
        success: true,
        anneeScolaire,
        moisActuel: now.toLocaleString('fr-FR', { month: 'long' }),
        totalImpayes: impayes.length,
        liste: impayes
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur récupération impayés",
        erreur: error.message
      });
    }
};

exports.getRepartitionModesPaiement = async (req, res) => {
    try {
      const filtre = { statut: { $ne: 'Annulé' } };
      if (req.user.role === 'comptable') {
        filtre.comptable = new mongoose.Types.ObjectId(req.user.id);
      }
  
      const repartition = await Paiement.aggregate([
        { $match: filtre },
        { $group: { _id: "$modePaiement", montant: { $sum: "$montant" } } },
        { $sort: { montant: -1 } }
      ]);
  
      const result = repartition.map(r => ({
        mode: r._id || "Non spécifié",
        montant: r.montant
      }));
  
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur stats modes paiement", erreur: error.message });
    }
};
  
exports.listerEnumsPaiement = (req, res) => {
    try {
      const enums = getPaiementEnums();
      res.status(200).json({ success: true, data: enums });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur chargement enums", erreur: error.message });
    }
};