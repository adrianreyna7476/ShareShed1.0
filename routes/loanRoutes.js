const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const reservationController = require('../controllers/reservationController');
const { requireLogin } = require('../middleware/auth');

router.get('/my-tools', requireLogin, loanController.showMyTools);
router.post('/reservations/:id/pickup', requireLogin, reservationController.pickUp);
router.post('/reservations/:id/cancel', requireLogin, reservationController.cancel);
router.get('/loans/:id/return', requireLogin, loanController.showReturnForm);
router.post('/loans/:id/return', requireLogin, loanController.handleReturn);

module.exports = router;
