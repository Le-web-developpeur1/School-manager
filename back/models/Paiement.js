const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema({
    eleve: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Eleve',
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    mois: {
        type: String,
        required: true,       
    },
    motif: {
        type: String,
        required: true
    },
    datePaiement: {
        type: Date,
        default: Date.now
    },
    anneeScolaire: {
        type: String,
        required: true
    },
    comptable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Paiement', paiementSchema)