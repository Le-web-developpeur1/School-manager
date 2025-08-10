const Matiere = require('../models/matiere');

exports.createMatiere = async (req, res) => {
    try {
        const timestamps = Date.now().toString().slice(-6);
        const code = `MAT${timestamps}`;
        const { nom, classe } = req.body;

        const newMatiere = new Matiere({ nom, code, classe });

        await newMatiere.save();
        res.status(201).json({
            success: true,
            message: "Matière ajouté avec succès !",
            newMatiere
        });
    } catch (error) {
        console.error("Erreur lors de la création :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getMatieres = async (req, res) => {
    try {
        const matieres = await Matiere.find()
            .populate('classe', 'nom');
            res.status(200).json({
                success: true,
                matieres
            });
    } catch (error) {
        console.error('Erreur lors de la récupération des matières :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateMatiere = async (req, res) => {
    try {
        const updated = await Matiere.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        console.error('Erreur lors de la modification de la matière :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteMatiere = async (req, res) => {
    try {
        const { id } = req.params;
        await Matiere.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Matière supprimée avec succès !"
        })
    } catch (error) {
        console.error('Erreur de suppression matière :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};