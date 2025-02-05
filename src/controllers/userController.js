const User = require("../models/User");


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
