// routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['comptable']), financeController.creerPaiement);
router.get('/', authMiddleware, checkRole(['comptable', 'admin']), financeController.listerPaiements);

module.exports = router;
