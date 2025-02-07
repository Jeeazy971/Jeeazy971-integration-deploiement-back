const express = require("express");
const { createUser, getUsers, deleteUser, getAdmins } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Créer un utilisateur par l'administrateur
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
 *         description: Utilisateur déjà existant.
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
 *             examples:
 *               exemple:
 *                 value: [
 *                   {
 *                     "_id": "60f7b2c9e3a1f1234567890a",
 *                     "firstName": "Alice",
 *                     "lastName": "Dupont",
 *                     "email": "alice.dupont@example.com",
 *                     "birthDate": "1980-05-20T00:00:00.000Z",
 *                     "city": "Paris",
 *                     "postalCode": "75001",
 *                     "role": "user"
 *                   }
 *                 ]
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
 *             examples:
 *               exemple:
 *                 value: [
 *                   {
 *                     "_id": "60f7b2c9e3a1f1234567890b",
 *                     "firstName": "Admin",
 *                     "lastName": "User",
 *                     "email": "loise.fenoll@ynov.com",
 *                     "birthDate": "1990-01-01T00:00:00.000Z",
 *                     "city": "Paris",
 *                     "postalCode": "75000",
 *                     "role": "admin"
 *                   }
 *                 ]
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
 *     summary: Supprimer un utilisateur créé par l'administrateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'utilisateur à supprimer, par exemple "60f7b2c9e3a1f1234567890a"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       403:
 *         description: Accès interdit.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
