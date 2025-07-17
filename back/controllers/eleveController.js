const Eleve = require('../models/Eleve');
const genereMatricule = require('../helpers/genereMatricule');

exports.ajouterEleve = async (req, res) => {
    try {
        const matricule = await genereMatricule(req.body.anneeScolaire);
        const nouvelEleve = new Eleve({...req.body, matricule });
        await nouvelEleve.save();
        res.status(201).json(nouvelEleve);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'élève", error});
    }
};

exports.listerEleves = async (req, res) => {
    try {
        const filtre = {};

        //Filtre par achivage
        if (req.query.archive !== undefined) {
            filtre.archive = req.query.archive === 'true';
        }

        //Filtre par classe
        if (req.query.classe) {
            filtre.classe = req.query.classe;
        }

        //Filtre par année scolaire
        if (req.query.anneeScolaire) {
            filtre.anneeScolaire = req.query.anneeScolaire;
        }

        const eleves = await Eleve.find(filtre).populate('classe');

        res.status(200).json({ eleves });
    } catch (error) {
        res.Status(500).json({ message: "Erreur lors du listintg", erreur: error.message });
    }
};

exports.modifierEleve = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const eleveMaj = await Eleve.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        }).populate('classe');

        if (!eleveMaj) {
            return res.status(404).json({ message: "Élève non trouvé !" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Élève modifié(e) avec succès !",
                eleve: eleveMaj
            });
        }
    } catch (error) {
        console.log("Erreur lors de la modification de l'élève", error);
        res.status(500).json({ message: "Erreur serveur ", erreu: error.message});
    }
};

exports.archiverEleve = async (req, res) => {
    try {
        const { id } = req.params;

        const eleve = await Eleve.findById(id);
        if (!eleve) {
            return res.status(404).json({
                success: false,
                message: "Élève introuvable"
            });
        } else {
            eleve.archive = true;
            await eleve.save();
            res.status(200).json({
                success: true,
                message: "Élève archivé avec succès !", 
                eleve
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'archivage", erreur: error.message });
    }
};

exports.supprimerEleve = async (req, res) => {
    try {
        const { id } = req.params;

        const eleveSupprime = await Eleve.findByIdAndDelete(id);

        if (!eleveSupprime) {
            return res.status(404).json({
                success: false,
                message: "Élève non trouvé"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Élève supprimé(e) avec succès !"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};

