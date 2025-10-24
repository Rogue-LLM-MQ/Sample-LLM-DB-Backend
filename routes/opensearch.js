//routes/opensearch.js
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { sendLog, getLogs } = require('../controllers/opensearchController');

router.post('/logs', auth, sendLog);   // for receiving logs
router.get('/logs', auth, getLogs);    // for viewing logs

module.exports = router;
