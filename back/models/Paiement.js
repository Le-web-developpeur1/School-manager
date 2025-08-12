const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema({
  eleve: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true
  },
  montant: {
    type: Number,
    required: true,
    min: 0
  },
  mois: {
    type: String,
    enum: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    required: true
  },
  periode: {
    type: String,
    enum: ['Mensuel', 'Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Annuel'],
    default: 'Mensuel'
  },
  motif: {
    type: String,
    enum: ['Scolarité', 'Inscription', 'Transport', 'Cantine'],
    required: true
  },
  statut: {
    type: String,
    enum: ['Payé', 'En attente', 'Annulé'],
    default: 'Payé'
  },
  datePaiement: {
    type: Date,
    default: () => Date.now()
  },
  reference: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  anneeScolaire: {
    type: String,
    required: true,
    match: /^\d{4}-\d{4}$/  //Exemple : "2024-2025"
  },
  comptable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true 
});


module.exports = mongoose.model('Paiement', paiementSchema)