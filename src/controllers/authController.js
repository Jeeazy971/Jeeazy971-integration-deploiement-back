// authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Connexion (login) pour tous les utilisateurs.
 * Seuls les administrateurs peuvent se connecter via cette route.
 */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email et mot de passe sont requis." });
    }

    // 1) On cherche l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      // => renvoie "Utilisateur non trouvé."
      return res.status(400).json({ msg: "Utilisateur non trouvé." });
    }

    // 2) Vérification du mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // => renvoie "Mot de passe incorrect."
      return res.status(400).json({ msg: "Mot de passe incorrect." });
    }

    // 3) Vérification du rôle admin, si c'est la route réservée aux admins
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Accès réservé aux administrateurs." });
    }

    // 4) Génération du token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (error) {
    console.error("Erreur lors du login:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};


/**
 * Création d'un administrateur (si aucun admin n'existe déjà).
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email et mot de passe sont requis." });
    }
    const adminExist = await User.findOne({ role: "admin" });
    if (adminExist) {
      return res.status(400).json({ msg: "Un administrateur existe déjà." });
    }
    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email,
      password,
      birthDate: new Date("1990-01-01"),
      city: "Paris",
      postalCode: "75000",
      role: "admin"
    });
    await admin.save();
    return res.status(201).json({ msg: "Administrateur créé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'admin:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};
