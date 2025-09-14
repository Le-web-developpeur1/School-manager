const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const checkRole = require('../middleware/checkRole');
const authMiddleware = require('../middleware/authMiddleware');

 /* --EndPoints Admin--*/
router.get('/admin', authMiddleware, checkRole(["admin"]), settingController.getSettingsAdmin);
router.put('/admin', authMiddleware, checkRole(['admin']), settingController.updateSettingsAdmin);

/*--EndPoints Comptable*/
router.get('/comptable', authMiddleware, checkRole(['comptable']), settingController.getSettingsComptable);
router.put('/comptable', authMiddleware, checkRole(['comptable']), settingController.getSettingsComptable);
router.get('/user/profil', authMiddleware, checkRole(['comptable', 'admin']), settingController.getProfil);
router.put('/user/update-profil', authMiddleware, checkRole(['comptable', 'admin']), settingController.updateProfil);
router.put('/user/update-password', authMiddleware, checkRole(['comptable', 'admin']), settingController.updatePassword);

module.exports = router;
