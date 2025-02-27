const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    // L'utilisateur doit être authentifié (peu importe son rôle)
    if (!req.user) {
      return res.status(401).json({ msg: "Authentification requise." });
    }
    const { firstName, lastName, email, password, birthDate, city, postalCode, role } = req.body;
    if (!firstName || !lastName || !email || !password || !birthDate || !city || !postalCode) {
      return res.status(400).json({ msg: "Tous les champs obligatoires doivent être renseignés." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Cet utilisateur existe déjà." });
    }
    // Déterminer le rôle à affecter :  
    // – Si l'utilisateur authentifié est admin et un rôle valide est fourni, on l'utilise  
    // – Sinon, on force le rôle à "user"
    let assignedRole = "user";
    if (req.user.role === "admin" && role && ["user", "admin"].includes(role)) {
      assignedRole = role;
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      birthDate,
      city,
      postalCode,
      role: assignedRole,
      createdBy: req.user._id
    });
    await newUser.save();
    return res.status(201).json({ msg: "Utilisateur créé avec succès." });
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Seuls les administrateurs peuvent consulter la liste des utilisateurs créés par eux
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit." });
    }
    const users = await User.find({ createdBy: req.user._id });
    return res.json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit." });
    }
    const userId = req.params.id;
    const deleted = await User.findOneAndDelete({ _id: userId, createdBy: req.user._id });
    if (!deleted) {
      return res.status(404).json({ msg: "Utilisateur non trouvé ou non autorisé à être supprimé." });
    }
    return res.json({ msg: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Accès interdit." });
    }
    const admins = await User.find({ role: "admin" });
    return res.json(admins);
  } catch (error) {
    console.error("Erreur récupération administrateurs:", error);
    return res.status(500).json({ msg: "Erreur serveur." });
  }
};
