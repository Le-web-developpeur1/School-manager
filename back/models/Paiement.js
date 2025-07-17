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
    motif: {
        type: String
    },
    datePaiement: {
        type: Date,
        defaut: Date.new
    },
    comptable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Paiement', paiementSchema)