const Classe = require('../models/Classe');

exports.createClasse = async (req, res) => {
    try {
        const { nom, niveau, anneeScolaire } = req.body;
        const nouvelleClasse = new Classe({ nom, niveau, anneeScolaire});
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
}