// routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const filtrerParRole = require('../middleware/filtrerParRole');

router.post('/', authMiddleware, checkRole(['comptable']), financeController.creerPaiement);
router.get('/', authMiddleware, checkRole(['comptable']), filtrerParRole, financeController.listerPaiements);
router.put('/:id', authMiddleware, checkRole(['comptable']), financeController.updatePaiement);
router.patch('/:id/annuler', authMiddleware, checkRole(['comptable']), financeController.annulerPaiement);
router.get('/impayes', authMiddleware, checkRole(['comptable']), financeController.getImpayes);
router.get('/enums', authMiddleware, checkRole(['comptable']), financeController.listerEnumsPaiement);
router.get('/repartition-modes', authMiddleware, checkRole(['comptable']), financeController.getRepartitionModesPaiement);
router.get('/releve/:eleveId', authMiddleware, checkRole(['comptable']), financeController.releveEleve);
router.get('/total-par-classe/:classeId', authMiddleware, checkRole(['comptable']), financeController.totalParClasse);
router.get('/recherche-eleve', authMiddleware, checkRole(['comptable']), financeController.rechercherEleve);


module.exports = router;
