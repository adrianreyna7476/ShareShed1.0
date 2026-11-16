const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { requireManager } = require('../middleware/auth');

router.get('/manager', requireManager, managerController.showDashboard);
router.post('/manager/reports/:id/resolve', requireManager, managerController.resolveReport);

module.exports = router;
