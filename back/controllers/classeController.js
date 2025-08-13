const Classe = require('../models/Classe');
const Eleve = require('../models/Eleve');

exports.createClasse = async (req, res) => {
    try {
        const { nom, niveau, anneeScolaire, enseignant } = req.body;
        const nouvelleClasse = new Classe({ nom, niveau, anneeScolaire, enseignant });
        await nouvelleClasse.save();
        res.status(201).json(nouvelleClasse);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de la classe",
            erreur: err.message
        });
    }
};

exports.listerClasses = async (req, res) => {
    try {
        const classes = await Classe.find();
        res.status(200).json(classes);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des classes" });
    }
};

exports.modiferClasses = async (req, res) => {
    const { id } = req.params;
    const majData = req.body;

    try {
        const classeModifie = await Classe.findByIdAndUpdate(id, majData, {
            new: true,
            runValidators: true,
        });

        if (!classeModifie) {
            return res.status(404).json({ success: false, message: "Classe non trouvé" });
        }

        res.status(200).json({ 
            success: true,
            message: "Classe modifiée avec succès !",
            classe: classeModifie
        })
    } catch (error) {
        console.error("Une erreur est survenue lors de la modification de la classe ", error.message );
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

exports.supprimeClasse = async (req, res) => {
    const { id } = req.params;
    
    try {
        const classe = await Classe.findById(id);
        if (!classe) {
            return res.status(404).json({ success: false, message: "Classe non trouvée" });
        }

        await Classe.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Classe supprimée avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la classe :", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur", erreur: error.message });
    }
};

exports.assignEnseignant = async (req, res) => {
    const { id } = req.params;
    const { enseignant } = req.body;

    try {
        const classe = await Classe.findById(id);
        if (!classe) {
            return res.status(404).json({ message: "Classe introuvable" });
        }

        classe.enseignant= enseignant;
        await classe.save();

        res.status(200).json({ message: "Enseignant attribué avec succès !", classe });
    } catch (error) {
        console.error("Erreur d'attribution enseignant", error );
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};

exports.getClasseDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const classe = await Classe.findById(id).populate('enseignant', 'nom prenom email');

        const eleves = await Eleve.find({ classe: id }).select("nom prenom");

        if (!classe) {
            return res.status(404).json({ message: "Classe introuvable" });
        }

        res.status(200).json({ classe, eleves });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", erreur: error.message });
    }
};

exports.statsElevesParClasse = async (req, res) => {
    try {
      const classes = await Classe.find(); // récupère toutes les classes
      const stats = await Promise.all(
        classes.map(async (classe) => {
          const total = await Eleve.countDocuments({ classe: classe._id });
          return {
            nomClasse: classe.nom,
            total,
          };
        })
      );
  
      res.status(200).json({ success: true, eleves: stats });
    } catch (error) {
      console.error("Erreur stats élèves par classe", error.message);
      res.status(500).json({ success: false, message: "Erreur serveur", erreur: error.message });
    }
};
  
exports.getNiveaux = (req, res) => {
    res.json(["Maternelle", "Primaire", "Collège", "Lycée"]);
};

exports.getClasses = async (req, res) => {
    try {
        const { niveau } = req.query;
    
        const filter = niveau ? { niveau } : {};
        const classes = await Classe.find(filter).select("_id nom niveau");
    
        res.json(classes);
      } catch (error) {
        res.status(500).json({
          message: "Erreur lors du chargement des classes",
          erreur: error.message
        });
      }
};
  