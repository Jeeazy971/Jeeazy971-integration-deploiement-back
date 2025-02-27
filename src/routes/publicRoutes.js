// src/routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, getPublicUsers } = require("../controllers/publicController");

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Routes pour l'inscription publique et l'accès aux informations non sensibles
 */

/**
 * @swagger
 * /public/register:
 *   post:
 *     summary: "Inscription publique d'un utilisateur (rôle = user)"
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - birthDate
 *               - city
 *               - postalCode
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
 *                 example: "MySuperSecretPassword"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-04-15"
 *               city:
 *                 type: string
 *                 example: "Paris"
 *               postalCode:
 *                 type: string
 *                 example: "75001"
 *     responses:
 *       "201":
 *         description: "Inscription réussie (rôle = user)."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Inscription réussie."
 *       "400":
 *         description: "Données invalides (ex: email déjà pris, champs manquants)."
 *       "500":
 *         description: "Erreur serveur."
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /public/users:
 *   get:
 *     summary: Récupère la liste publique des utilisateurs inscrits (sans email ni date de naissance)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60f7b2c9e3a1f1234567890a"
 *                   firstName:
 *                     type: string
 *                     example: "Alice"
 *                   lastName:
 *                     type: string
 *                     example: "Dupont"
 *                   city:
 *                     type: string
 *                     example: "Paris"
 *                   postalCode:
 *                     type: string
 *                     example: "75001"
 *       500:
 *         description: Erreur serveur.
 */
router.get("/users", getPublicUsers);

module.exports = router;
