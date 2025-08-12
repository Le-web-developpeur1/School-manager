// routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['comptable']), financeController.creerPaiement);
router.get('/', authMiddleware, checkRole(['comptable']), financeController.listerPaiements);
router.get('/releve/:eleveId', authMiddleware, checkRole(['comptable']), financeController.releveEleve);
router.get('/total-par-classe/:classeId', authMiddleware, checkRole(['comptable']), financeController.totalParClasse);
router.get('/recherche-eleve', authMiddleware, checkRole(['comptable']), financeController.rechercherEleve);

module.exports = router;
