const mongoose = require('mongoose');

const classeShema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    niveau: {
        type: String,
        enum: [
            "Maternelle", "1ère", "2ème", "3ème", "4ème", "5ème", "6ème", "7ème", "8ème",
            "9ème", "10ème", "11ème S", "11ème L", "12ème S", "12ème L", "Terminale S", "Terminale L"
        ],
        required: true
    },
    anneeScolaire: {
        type: Number,
        required: true
    },
    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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