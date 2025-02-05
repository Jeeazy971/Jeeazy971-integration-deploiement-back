// tests/setup.js
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  try {
    // Uniformisez les identifiants de l'admin avec ceux utilisés dans les tests
    const admin = await User.findOne({ email: "loise.fenoll@ynov.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "loise.fenoll@ynov.com",
        password: hashedPassword,
        birthDate: new Date("1990-01-01"),
        city: "TestCity",
        postalCode: "00000",
        role: "admin"
      });
      console.log("✅ Admin seeded for tests");
    }
  } catch (error) {
    console.error("Erreur lors du seed de l'admin :", error);
  }
});
