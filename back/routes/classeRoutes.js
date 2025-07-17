const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['admin']), classeController.createClasse);
router.get('/', authMiddleware, checkRole(['admin']), classeController.listerClasses);

module.exports = router;