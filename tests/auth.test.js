// tests/auth.test.js
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Tests d'authentification", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
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
    await mongoose.disconnect();
  });
});
