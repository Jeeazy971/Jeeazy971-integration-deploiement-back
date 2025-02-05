const User = require("../models/User");

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
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
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
exports.createUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit" });
    }
    const { firstName, lastName, email, password, birthDate, city, postalCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Utilisateur existe déjà" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      birthDate,
      city,
      postalCode,
      role: "user",
      createdBy: req.user.id
    });
    await newUser.save();
    return res.status(201).json({ msg: "Utilisateur créé avec succès." });
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

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
exports.getUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit" });
    }
    const users = await User.find({ createdBy: req.user.id });
    return res.json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

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
 *         description: L'ID de l'utilisateur à supprimer
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
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit" });
    }
    const userId = req.params.id;
    const deleted = await User.findOneAndDelete({ _id: userId, createdBy: req.user.id });
    if (!deleted) {
      return res.status(404).json({ msg: "Utilisateur non trouvé ou non autorisé à être supprimé" });
    }
    return res.json({ msg: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

/**
 * (Optionnel) @swagger
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
exports.getAdmins = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit" });
    }
    const admins = await User.find({ role: "admin" });
    return res.json(admins);
  } catch (error) {
    console.error("Erreur récupération administrateurs:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};
