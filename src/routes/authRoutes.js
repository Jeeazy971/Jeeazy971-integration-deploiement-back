const express = require('express');
const { login, registerAdmin } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Routes pour l'authentification des utilisateurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: loise.fenoll@ynov.com
 *         password:
 *           type: string
 *           format: password
 *           example: ANKymoUTFu4rbybmQ9Mt
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentification et obtention du token JWT
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Succès - Retourne le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Créer un administrateur avec email et mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePass123"
 *     responses:
 *       201:
 *         description: Succès - Administrateur créé
 *       400:
 *         description: Un administrateur existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.post('/register-admin', registerAdmin);

module.exports = router;
