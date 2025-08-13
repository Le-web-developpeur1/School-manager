const mongoose = require('mongoose');

const classeShema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    niveau: {
        type: String,
        required: true
    },
    anneeScolaire: {
        type: Number,
        required: true
    },
    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    effectif: {
        type: Number,
        default: 0
    },
    actif : {
        type: Boolean,
        default: true
    }
});

module.exports  = mongoose.model('Classe', classeShema);