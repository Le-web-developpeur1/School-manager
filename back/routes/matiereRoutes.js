const express = require('express');
const { createMatiere, getMatieres, updateMatiere, deleteMatiere } = require('../controllers/matiereController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.post('/', authMiddleware, checkRole(['admin']), createMatiere);
router.get('/', authMiddleware, checkRole(['admin']), getMatieres);
router.put('/:id', authMiddleware, checkRole(['admin']), updateMatiere);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteMatiere);

module.exports = router;
