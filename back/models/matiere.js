const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    classe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cours', MatiereSchema);
