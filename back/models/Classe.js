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
        type: String,
        required: true
    },
    effectif: {
        type: Number,
        default: 0
    }
});

module.exports  = mongoose.model('Classe', classeShema);