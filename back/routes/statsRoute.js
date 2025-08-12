const express = require('express');
const router = express.Router();
const {
    getStats,
    getRepartitionParNiveau,
    getEncaissementsMensuels,
    getRatioElevesEnseignants,
    getRepartitionSexe
} = require('../controllers/statsController');
const { statsElevesParClasse } = require('../controllers/classeController') 
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard-admin', authMiddleware, getStats);
router.get('/encaissements-mensuels', authMiddleware, getEncaissementsMensuels);
router.get('/repartition-niveaux', authMiddleware, getRepartitionParNiveau);
router.get('/ratio-eleves-enseignants', authMiddleware, getRatioElevesEnseignants);
router.get('/repartition-sexe', authMiddleware, getRepartitionSexe);
router.get('/eleves-par-classe/', authMiddleware, statsElevesParClasse);


module.exports = router;