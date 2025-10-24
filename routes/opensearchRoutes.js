//routes/opensearch.js
const express = require('express');
const router = express.Router();
//const auth = require("../middleware/auth");
const { sendLog, getLogs } = require('../controllers/opensearchController');

/**
 * @swagger
 * tags:
 *   name: OpenSearch
 *   description: Endpoints for sending and retrieving LLM policy logs
 */

router.post('/logs', sendLog);   // for receiving logs
router.get('/logs', getLogs);    // for viewing logs

/**
 * @swagger
 * /opensearch/logs:
 *   post:
 *     summary: Send a log to OpenSearch
 *     tags: [OpenSearch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               "@timestamp":
 *                 type: string
 *                 example: "2025-10-24T10:00:00Z"
 *               event:
 *                 type: object
 *                 example: { "action": "policy.enforced" }
 *               rule:
 *                 type: object
 *                 example: { "id": 1, "source": "dynamic" }
 *               http:
 *                 type: object
 *                 example: { "request": { "method": "GET", "referrer": "https://example.com" } }
 *               url:
 *                 type: string
 *                 example: "https://example.com/api/test"
 *               chrome:
 *                 type: object
 *                 example: { "tabId": 42 }
 *     responses:
 *       200:
 *         description: Log successfully sent to OpenSearch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Log successfully sent to OpenSearch"
 *                 result:
 *                   type: object
 *       400:
 *         description: Invalid log format
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get recent logs from OpenSearch
 *     tags: [OpenSearch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of logs to fetch
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

module.exports = router;
