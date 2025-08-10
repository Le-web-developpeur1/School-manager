const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole(['admin']), userController.createUser);
router.get('/', authMiddleware, checkRole(['admin']), userController.getUser);
router.put('/:id', authMiddleware, checkRole(['admin']), userController.updateUser);
router.put('/:id/toggle-active', authMiddleware, checkRole(['admin']), userController.toogleActivation);
router.delete('/:id', authMiddleware, checkRole(['admin']), userController.deleteUser);
module.exports = router;
