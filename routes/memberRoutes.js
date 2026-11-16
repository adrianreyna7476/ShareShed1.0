const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/signup', memberController.showSignup);
router.post('/signup', memberController.handleSignup);
router.get('/login', memberController.showLogin);
router.post('/login', memberController.handleLogin);
router.post('/logout', memberController.handleLogout);

module.exports = router;