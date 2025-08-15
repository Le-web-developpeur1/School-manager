const Eleve = require('../models/Eleve');
const Paiement = require('../models/Paiement');
const { genererReferencePaiement } = require('../services/referenceService');

exports.creerPaiement = async (req, res) => {
    try {
        const { eleve, montant, motif, datePaiement, anneeScolaire, mois, periode } = req.body;
        const comptable = req.user.id;

        const eleveExiste = await Eleve.findById(eleve);
        if (!eleveExiste) {
            return res.status(404).json({ success: false, message:"Élève introuvable" });
        }
        const reference = genererReferencePaiement();

        const paiement = await Paiement.create({ 
            eleve, 
            montant,
            mois,
            periode,
            datePaiement,
            motif, 
            anneeScolaire,
            comptable,
            reference
        });
        res.status(201).json({ success: true, message: "Paiement enrégistré avec succès !", paiement });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur d'ajout paiement", erreur: error.message });
    }
};

exports.listerPaiements = async (req, res) => {
    try {
       const filtre = {};

       if (req.query.eleve) {
        filtre.eleve = req.query.eleve;
       }

       if (req.query.anneeScolaire) {
        filtre.anneeScolaire = req.query.anneeScolaire;
       }

       const page = parseInt(req.query.page) || 1;
       const limit = parseInt(req.query.limit) || 20;
       const skip = (page - 1) * limit;

       const paiements = await Paiement.find(filtre)
        .populate('eleve', 'nom prenom matricule')
        .populate('comptable', 'nom prenom')
        .sort({datePaiement: -1 })
        .skip(skip)
        .limit(limit);

        res.status(200).json({ success: true, page, paiements });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des paiements", erreur: error.message });
    }
};

exports.releveEleve = async (req, res) => {
    try {
        const { eleveId } = req.params;
        const { anneeScolaire } = req.query;

        //Le filtre de base
        const filtre = { eleve: eleveId };

        //Si une année scolaire est précisée, on l'ajoute au filtre
        if (anneeScolaire) {
            filtre.anneeScolaire = anneeScolaire;
        }

        //Récupération des paiements selon les critères
        const paiements = await Paiement.find(filtre)
            .populate('comptable', 'nom prenom')
            .sort({ datePaiement: 1 });

        const eleveInfo = await Eleve.findById(eleveId, 'nom prenom matricule');

        //Calcul du total encaissé
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

        //Récupération des éleves de chaque classe
        const eleveDeLaClasse = await Eleve.find({ classe: classeId }, '_id');

        //Extration des IDs des élèves
        const idEleves = eleveDeLaClasse.map(e => e._id);

        //Construction du filtre
        const filtrePaiement = { eleve: { $in: idEleves } };

        //Filtre par année scolaire si fourni
        if (anneeScolaire) {
            filtrePaiement.anneeScolaire = anneeScolaire;
        }

        //Filtre mensuel si mois + année sont fournis
        if (mois && annee) {
            const debut = new Date(annee, mois - 1, 1);
            const fin = new Date(annee, mois, 1);
            filtrePaiement.datePaiement = { $gte: debut, $lt: fin };
        }

        //Récupération de tous les paiements liés
        const paiements = await Paiement.find(filtrePaiement);

        //Total encaissé
        const total = paiements.reduce((acc, p) => acc + p.montant, 0);

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