const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['admin']), classeController.createClasse);
router.get('/', authMiddleware, checkRole(['admin']), classeController.listerClasses);
router.put('/:id', authMiddleware, checkRole(['admin']), classeController.modiferClasses);
router.delete('/:id', authMiddleware, checkRole(['admin']), classeController.supprimeClasse);
router.get('/:id/details', authMiddleware, checkRole(['admin','comptable']), classeController.getClasseDetails);
router.get('/niveaux', authMiddleware, checkRole(['admin','comptable']), classeController.getNiveaux);
router.get('/classe', authMiddleware, checkRole(['admin','comptable']), classeController.getClasses);


module.exports = router;