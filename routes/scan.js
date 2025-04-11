const express = require('express');
const router = express.Router();
const { handleScan } = require('../controllers/scanController');

router.post('/', handleScan);

module.exports = router;
