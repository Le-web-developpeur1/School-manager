const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['admin']), userController.createUser);
router.get('/', authMiddleware, checkRole(['admin']), userController.listerUser);
router.put('/:id', authMiddleware, checkRole(['admin']), userController.modifierUtilisateur);

module.exports = router;
