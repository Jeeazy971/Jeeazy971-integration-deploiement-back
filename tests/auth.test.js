// tests/auth.test.js
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

describe("Tests d'authentification", () => {
  beforeAll(async () => {
    console.log("🌍 Connexion à la base de test MongoDB...");
    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log("✅ MongoDB Connecté à test");

    const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "loise.fenoll@ynov.com",
        password: hashedPassword,
        birthDate: new Date("1990-01-01"),
        city: "Paris",
        postalCode: "75000",
        role: "admin",
      });
      console.log("✅ Admin seeded for tests");
    } else {
      console.log("ℹ️ Admin déjà en base, pas besoin de l'insérer.");
    }
  });

  it("Devrait retourner un token pour un admin valide", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loise.fenoll@ynov.com",
        password: "ANKymoUTFu4rbybmQ9Mt",
      });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Devrait refuser l'accès avec un email invalide", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Utilisateur non trouvé");
  });

  it("Devrait refuser l'accès avec un mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loise.fenoll@ynov.com",
        password: "wrongpassword",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Mot de passe incorrect");
  });

  afterAll(async () => {
    console.log("🧹 Nettoyage de la base de test...");
    await User.deleteMany({ role: "user" }); 
    console.log("✅ Suppression des utilisateurs test OK.");

    console.log("🔌 Fermeture de la connexion MongoDB...");
    await mongoose.disconnect();
    console.log("✅ Connexion MongoDB fermée.");
  });
});
