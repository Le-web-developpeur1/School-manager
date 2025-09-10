const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
  eleve: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true
  },
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe',
    required: true
  },
  anneeScolaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnneeScolaire',
    required: true
  },
  dateInscription: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ["Inscrit", "Promu", "Transféré"],
    default: "Inscrit"
  }
});

module.exports = mongoose.model('Inscription', inscriptionSchema);
