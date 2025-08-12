// routes/exports.js
const express = require('express');
const router = express.Router();
const { exporterListeEleves } = require('../controllers/exports/exportEleves');
const { 
    exportPaiementsClasse, 
    exportPaiementsClassePDF 
} = require('../controllers/exports/exportPaiements');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


router.get('/liste-eleves/excel', authMiddleware, checkRole(['admin', 'comptable']), exporterListeEleves); // admin et comptable
router.get('/classe/:classeId', authMiddleware, checkRole(['comptable']), exportPaiementsClasse); // comptable
router.get('/classe/:classeId/pdf', authMiddleware, checkRole(['comptable']), exportPaiementsClassePDF); // comptable

module.exports = router;
