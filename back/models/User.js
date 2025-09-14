const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator : validator.isEmail,
            message: 'Email non valide',
        },
    },
    telephone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'comptable', 'enseignant'],
    },
    actif: {type: Boolean, default: true},
    dateInscription: {type: Date, default: Date.now},
    lastLogin: { type: Date },
});

module.exports = mongoose.model('User', userSchema);