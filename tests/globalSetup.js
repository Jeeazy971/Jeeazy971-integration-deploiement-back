// tests/globalSetup.js
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const dotenv = require("dotenv");

// Charger les variables depuis .env.test
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
console.log("Chargement des variables d'environnement depuis .env.test (globalSetup)");

module.exports = async () => {
  // Connexion à la BDD de test
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connexion à la base de test effectuée (globalSetup)");

  // Nettoyage complet de la collection User
  await User.deleteMany({});

  // Création de l'administrateur
  const adminEmail = process.env.ADMIN_EMAIL || "loise.fenoll@ynov.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPasswordAdmin = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
    admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: hashedPasswordAdmin,
      birthDate: new Date("1990-01-01"),
      city: "TestCity",
      postalCode: "00000",
      role: "admin",
    });
    console.log("Admin créé (globalSetup)");
  } else {
    console.log("Admin déjà présent (globalSetup)");
  }

  // Création d'un utilisateur de test
  const testUserEmail = "john.doe@example.com";
  let testUser = await User.findOne({ email: testUserEmail });
  if (!testUser) {
    const hashedPasswordUser = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      password: hashedPasswordUser,
      birthDate: new Date("1990-01-01"),
      city: "Paris",
      postalCode: "75001",
      role: "user",
    });
    console.log("Utilisateur de test créé (globalSetup)");
  }
  
  // Déconnexion pour laisser les tests se reconnecter
  await mongoose.disconnect();
  console.log("Déconnexion effectuée (globalSetup)");
};
