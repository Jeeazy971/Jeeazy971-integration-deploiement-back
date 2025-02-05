const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Utilisateur non trouvé' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Mot de passe incorrect' });

        // 📌 Remplace `isAdmin: true` par `role: "admin"`
        const token = jwt.sign(
            { id: user._id, role: user.role }, // 🔥 Assure-toi que `role` est bien ajouté
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};


/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Créer un administrateur initial si aucun n'existe
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
 *                 example: "superSecurePass123"
 *     responses:
 *       201:
 *         description: Succès - Administrateur créé
 *       400:
 *         description: Un administrateur existe déjà
 *       500:
 *         description: Erreur serveur
 */
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email et mot de passe sont requis.' });
        }

        // Vérifie si un administrateur existe déjà
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            return res.status(400).json({ msg: "Un administrateur existe déjà." });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un administrateur avec un rôle défini
        const admin = new User({
            email,
            password: hashedPassword,
            role: "admin",
            firstName: "Admin",
            lastName: "User",
            birthDate: new Date("1990-01-01"),
            city: "Default City",
            postalCode: "00000"
        });

        await admin.save();
        res.status(201).json({ msg: "Administrateur créé avec succès." });

    } catch (error) {
        console.error("Erreur lors de la création de l'administrateur :", error);
        res.status(500).json({ msg: "Erreur serveur" });
    }
};