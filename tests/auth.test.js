const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Tests d'authentification", () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Devrait retourner un token pour un admin valide", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loise.fenoll@ynov.com",
        password: "ANKymoUTFu4rbybmQ9Mt"
      });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Devrait refuser l'accès avec un email invalide", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@example.com",
        password: "wrongpassword"
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Utilisateur non trouvé");
  });
});
