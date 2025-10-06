const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getAllLLMs, createLLM, updateLLM, deleteLLM } = require("../controllers/crud");

/**
 * @swagger
 * tags:
 *   name: LLMs
 *   description: CRUD operations for LLM signatures
 */

module.exports = (db) => {
  // GET all LLMs
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
   *                   domain:
   *                     type: string
   *                     example: chatgpt.com
   */
  router.get("/", (req, res) => getAllLLMs(req, res, db));

  // POST create LLM
  /**
   * @swagger
   * /llms:
   *   post:
   *     summary: Create a new LLM signature
   *     tags: [LLMs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - domain
   *             properties:
   *               domain:
   *                 type: string
   *                 example: chatgpt.com
   *     responses:
   *       201:
   *         description: LLM created successfully
   *       400:
   *         description: Missing required fields
   */
  router.post("/", auth, (req, res) => createLLM(req, res, db));

  // PUT update LLM
  /**
   * @swagger
   * /llms/{id}:
   *   put:
   *     summary: Update an existing LLM signature
   *     tags: [LLMs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: LLM ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               domain:
   *                 type: string
   *     responses:
   *       200:
   *         description: LLM updated successfully
   *       404:
   *         description: LLM not found
   */
  router.put("/:id", auth, (req, res) => updateLLM(req, res, db));

  // DELETE LLM
  /**
   * @swagger
   * /llms/{id}:
   *   delete:
   *     summary: Delete an existing LLM signature
   *     tags: [LLMs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: LLM ID
   *     responses:
   *       200:
   *         description: LLM deleted successfully
   *       404:
   *         description: LLM not found
   */
  router.delete("/:id", auth, (req, res) => deleteLLM(req, res, db));

  return router;
};
