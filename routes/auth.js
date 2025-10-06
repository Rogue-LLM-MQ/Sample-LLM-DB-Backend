const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login to obtain JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: JWT token returned on successful login
 *       401:
 *         description: Invalid credentials
 */

module.exports = (db) => {
  router.post("/login", (req, res) => login(req, res, db));
  return router;
};
