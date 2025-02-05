const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion de l'administrateur et obtention du token JWT
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
 *                 example: loise.fenoll@ynov.com
 *               password:
 *                 type: string
 *                 example: ANKymoUTFu4rbybmQ9Mt
 *     responses:
 *       200:
 *         description: Retourne un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Email ou mot de passe incorrect.
 *       403:
 *         description: Accès réservé aux administrateurs.
 *       500:
 *         description: Erreur serveur.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email et mot de passe sont requis." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Utilisateur non trouvé" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect" });

    // Seul un administrateur peut se connecter via cette route
    if (user.role !== "admin")
      return res.status(403).json({ msg: "Accès réservé aux administrateurs" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  } catch (error) {
    console.error("Erreur lors du login:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /auth/register-admin:
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
 *                 example: "loise.fenoll@ynov.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "ANKymoUTFu4rbybmQ9Mt"
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès.
 *       400:
 *         description: Un administrateur existe déjà.
 *       500:
 *         description: Erreur serveur.
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email et mot de passe sont requis." });

    // Vérifier si un admin existe déjà
    // const adminExist = await User.findOne({ role: "admin" });
    // if (adminExist)
    //   return res.status(400).json({ msg: "Un administrateur existe déjà." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email,
      password: hashedPassword,
      birthDate: new Date("1990-01-01"),
      city: "Paris",
      postalCode: "75000",
      role: "admin"
    });
    await admin.save();
    return res.status(201).json({ msg: "Administrateur créé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'admin:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};
