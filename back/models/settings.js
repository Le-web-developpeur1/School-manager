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
    roles: {
        admin: { type: Boolean, default: true },
        enseignant: { type: Boolean, default: true },
        comptable: { type: Boolean, default: true }
    },
    grandingPolicy: {
        useCoefficients: { type: Boolean, default: false},
        rounding: { type: Boolean, default: true }
    },
    notifications: {
        emailEnabled: { type: Boolean, default: false },
        smsEnabled: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingSchema);