const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

router.get('/tools', toolController.showCatalog);

module.exports = router;