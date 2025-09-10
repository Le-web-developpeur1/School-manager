const mongoose = require("mongoose");

const anneeScolaireSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true
    },
    debut: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('AnneeScolaire', anneeScolaireSchema);