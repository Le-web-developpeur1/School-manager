const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleveController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['admin']), eleveController.ajouterEleve);
router.get('/', authMiddleware, checkRole(['admin', 'enseignant']), eleveController.listerEleves);
router.put('/:id', authMiddleware, checkRole(['admin']), eleveController.modifierEleve);
router.delete('/:id', authMiddleware, checkRole(['admin']), eleveController.supprimerEleve);
router.patch('/:id/archive', authMiddleware, checkRole(['admin']), eleveController.archiverEleve);
router.get("/eleves-par-classe", authMiddleware, checkRole(['admin']), eleveController.elevesParClasse);


module.exports = router;