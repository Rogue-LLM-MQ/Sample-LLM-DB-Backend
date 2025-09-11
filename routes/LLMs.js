const express = require("express");
const router = express.Router();
const { getAllLLMs } = require("../controllers/crud");

/**
 * @swagger
 * tags:
 *   name: LLMs
 *   description: Endpoints for querying LLM signatures
 */

/**
 * @swagger
 * /llms:
 *   get:
 *     summary: Get all LLM signatures
 *     tags: [LLMs]
 *     responses:
 *       200:
 *         description: List of LLM signatures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64a7df932d1b3a0f88c12345
 *                   name:
 *                     type: string
 *                     example: ChatGPT
 *                   version:
 *                     type: string
 *                     example: "4.0"
 */

module.exports = (db) => {
  // bind db into controller call
  router.get("/", (req, res) => getAllLLMs(req, res, db));

  return router;
};
