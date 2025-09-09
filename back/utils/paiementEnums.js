const paiementSchema = require('../models/Paiement').schema;

const extractEnum = (field) => paiementSchema.path(field)?.enumValues || [];

module.exports = {
  getPaiementEnums: () => ({
    mois: extractEnum('mois'),
    periode: extractEnum('periode'),
    motif: extractEnum('motif'),
    modePaiement: extractEnum('modePaiement'),
    statut: extractEnum('statut')
  })
};