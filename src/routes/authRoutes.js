const express = require('express');
const { login, registerAdmin } = require('../controllers/authController');
const router = express.Router();

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
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     RegisterAdminRequest:
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
 */

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Routes pour la gestion de l’authentification des administrateurs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentification de tout utilisateur (admin ou user)
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Identifiants incorrects.
 *       401:
 *         description: Token invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/register-admin:
 *   post:
 *     summary: Création d'un administrateur (seulement si aucun admin n'existe déjà)
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminRequest'
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès.
 *       400:
 *         description: Un administrateur existe déjà ou données invalides.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/register-admin', registerAdmin);

module.exports = router;
