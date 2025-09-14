const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true,
        unique: true
    },
     formatExport: {
        type: String,
        enum: ["PDF", "Excel"],
        default: "PDF"
    },
    colonnesExport: [
        {
            type: String
        }
    ],
    orientation: {
        type: String,
        enum: ["Portrait", "Paysage"],
        default: "Portrait"
    },
    nomFichier: {
        type: String,
        default: "Releve_{nom}_{mois}_{annee}"
    },
    anneeScolaireActive: { type: String },
    moisFiscalDepart: { type: String },
    periodeCloture: { type: String },
    notifications: {
        alertesPaiement: { type: Boolean, default: true },
        mailExport: { type: Boolean, default: false },
        rappelCloture: { type: Boolean, default: false }
    },
}, { timestamps: true });

module.exports = mongoose.model("SettingsComptable", settingsSchema);