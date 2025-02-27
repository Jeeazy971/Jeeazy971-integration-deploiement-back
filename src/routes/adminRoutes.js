const express = require("express");
const { createUser, getUsers, deleteUser, getAdmins } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Créer un utilisateur authentifié
 *     description: >
 *       Cet endpoint permet à un utilisateur authentifié de créer un nouvel utilisateur.
 *       - Si l'utilisateur connecté est **admin**, il peut spécifier le rôle du nouvel utilisateur (user ou admin).
 *       - Si l'utilisateur connecté est **user**, le rôle sera forcé à "user", quelle que soit la valeur envoyée.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objet contenant les informations de l'utilisateur à créer.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Alice"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "alice.dupont@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1980-05-20"
 *               city:
 *                 type: string
 *                 example: "Paris"
 *               postalCode:
 *                 type: string
 *                 example: "75001"
 *               role:
 *                 type: string
 *                 enum: [ "user", "admin" ]
 *                 example: "user"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - birthDate
 *               - city
 *               - postalCode
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Utilisateur créé avec succès."
 *       400:
 *         description: Données invalides ou utilisateur existant.
 *       401:
 *         description: Authentification requise.
 *       403:
 *         description: Accès interdit.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/create", authMiddleware, createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs créés par l'administrateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès interdit.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/", authMiddleware, getUsers);

/**
 * @swagger
 * /users/admins:
 *   get:
 *     summary: Récupérer la liste de tous les administrateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des administrateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès interdit.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/admins", authMiddleware, getAdmins);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur créé par l'utilisateur authentifié
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'utilisateur à supprimer.
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *       403:
 *         description: Accès interdit.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
