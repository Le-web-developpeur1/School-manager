const mongoose = require('mongoose');

const coursSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    enseignant : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe',
        required: true
    },
    horaires: {
        type: String
    }
});

module.exports = mongoose.model('Cours', coursSchema);
