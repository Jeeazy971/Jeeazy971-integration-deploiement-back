const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 📌 Inscription d'un utilisateur
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, birthDate, city, postalCode } = req.body;

    // Vérification de l'âge
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 18) {
        return res.status(400).json({ msg: 'Vous devez avoir plus de 18 ans' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Utilisateur déjà existant' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ firstName, lastName, email, password: hashedPassword, birthDate, city, postalCode, role: "user" });
        await user.save();

        res.status(201).json({ msg: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs (sans les admins, email et date de naissance cachés)
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Succès - Liste des utilisateurs
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }, '-email -birthDate');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};

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
 *       403:
 *         description: Accès interdit - Authentification requise
 */
exports.getAdmins = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: 'Accès interdit. Seuls les administrateurs peuvent voir cette liste.' });
    }

    try {
        const admins = await User.find({ role: "admin" }, '-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};

// 📌 Suppression d'un utilisateur (admin uniquement)
exports.deleteUser = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Accès interdit" });
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};

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
 *       400:
 *         description: Erreur - Données invalides
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */
exports.createUser = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: 'Accès interdit. Seuls les administrateurs peuvent créer des utilisateurs.' });
    }

    const { firstName, lastName, email, password, birthDate, city, postalCode, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Cet utilisateur existe déjà.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === "admin" && req.user.role === "admin" ? "admin" : "user";

        user = new User({ firstName, lastName, email, password: hashedPassword, birthDate, city, postalCode, role: userRole });

        await user.save();
        res.status(201).json({ msg: `Utilisateur ${userRole} créé avec succès.` });
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};
