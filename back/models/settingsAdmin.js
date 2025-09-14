const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        default: 'Afric/Conakry'
    },
    language: {
        type: String,
        default: 'fr'
    },
    permissions: {
        admin: [ "exports", "paiements", "parametres" ],
        enseignant: [ "eleves", "notes" ],
        comptable: [ "paiements", "exports" ]
    },
    logoUrl: { 
        type: String, 
        default: "" 
    },
    periods: [
        {
          nom: String,
          debut: Date,
          fin: Date
        }
    ], 
    grandingPolicy: {
        useCoefficients: { type: Boolean, default: false},
        rounding: { type: Boolean, default: true }
    },
    notifications: {
        emailEnabled: { type: Boolean, default: false },
        smsEnabled: { type: Boolean, default: false }
    },
    exportDefaults: {
        filePrefix: { type: String, default: "Releve_" },
        includeSignature: { type: Boolean, default: true },
        formatMontant: { type: String, enum: ["fr", "us"], default: "fr" }
    },      
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingSchema);