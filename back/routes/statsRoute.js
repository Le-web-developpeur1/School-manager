const express = require('express');
const router = express.Router();
const {
    getStats,
    getRepartitionParNiveau,
    getEncaissementsMensuels,
    getRatioElevesEnseignants,
    getRepartitionSexe,
    repartitionMotif
} = require('../controllers/statsController');
const { statsElevesParClasse } = require('../controllers/classeController') 
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


router.get('/paiements', authMiddleware, checkRole(["admin", "comptable"]), getStats);
router.get('/encaissements-mensuels', authMiddleware, getEncaissementsMensuels);
router.get('/repartition-niveaux', authMiddleware, getRepartitionParNiveau);
router.get('/ratio-eleves-enseignants', authMiddleware, getRatioElevesEnseignants);
router.get('/repartition-sexe', authMiddleware, getRepartitionSexe);
router.get('/eleves-par-classe/', authMiddleware, statsElevesParClasse);
router.get('/motif', authMiddleware, repartitionMotif);

module.exports = router;