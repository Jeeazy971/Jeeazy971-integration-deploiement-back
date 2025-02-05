const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  try {
    // Si aucun admin n'est présent, on le créé
    const admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("hashedpassword", 10);
      await User.create({
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        birthDate: new Date("1990-01-01"),
        city: "TestCity",
        postalCode: "00000"
      });
      console.log("✅ Admin seeded for tests");
    }
  } catch (error) {
    console.error("Erreur lors du seed de l'admin :", error);
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log("🛑 Connexion MongoDB fermée après les tests");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture de la connexion MongoDB:", error);
  }
});
