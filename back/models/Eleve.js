const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    sexe: {
        type: String,
        required: true,
        enum: ["Masculin", "Feminin"]
    },
    dateNaissance: {
        type: Date
    },
    parentContact: {
        type: String,
        trim: true
    },
    niveau: String,
    classe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe',
        required: true
    },
    anneeScolaire: {
        type: String,
        required: true
    },
    matricule: {
        type: String,
        required: true,
        unique: true
    },
    archive: {
        type: Boolean,
        default: false
    },
    dateAjout: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Eleve', eleveSchema);