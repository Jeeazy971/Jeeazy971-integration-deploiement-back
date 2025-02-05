const express = require('express');
const { getUsers, getAdmins, createUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - birthDate
 *         - city
 *         - postalCode
 *       properties:
 *         id:
 *           type: string
 *           example: "60b6c6e5d5a5a823d4f01b99"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "password123"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "2000-05-15"
 *         city:
 *           type: string
 *           example: "Paris"
 *         postalCode:
 *           type: string
 *           pattern: "^[0-9]{5}$"
 *           example: "75000"
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           example: "Utilisateur enregistré avec succès"
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - birthDate
 *         - city
 *         - postalCode
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Alice"
 *         lastName:
 *           type: string
 *           example: "Dupont"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice.dupont@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "securepassword123"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-06-15"
 *         city:
 *           type: string
 *           example: "Lyon"
 *         postalCode:
 *           type: string
 *           pattern: "^[0-9]{5}$"
 *           example: "69000"
 *         isAdmin:
 *           type: boolean
 *           example: false
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           example: "Utilisateur créé avec succès."
 */


/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Créer un utilisateur ou un administrateur (réservé aux admins)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Succès - Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Erreur - Données invalides
 *       403:
 *         description: Accès interdit - Authentification requise
 *       500:
 *         description: Erreur serveur
 */
router.post("/create", authMiddleware, createUser); // 🔒 Route protégée avec JWT

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs (email et date de naissance cachés)
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Succès - Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/users/admins:
 *   get:
 *     summary: Récupérer la liste des administrateurs (réservé aux admins)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès - Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès interdit - Authentification requise
 */
router.get('/admins', authMiddleware, getAdmins);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin uniquement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès - Utilisateur supprimé
 *       403:
 *         description: Accès interdit - Authentification requise
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
