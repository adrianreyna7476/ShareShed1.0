const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const reservationController = require('../controllers/reservationController');
const { requireLogin } = require('../middleware/auth');

router.get('/tools', toolController.showCatalog);
router.post('/tools/:id/reserve', requireLogin, reservationController.reserveTool);

module.exports = router;
