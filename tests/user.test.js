jest.setTimeout(30000);
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;

describe("Tests de gestion des utilisateurs", () => {
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loise.fenoll@ynov.com",
        password: "ANKymoUTFu4rbybmQ9Mt"
      });
    token = res.body.token;
  });

  it("Devrait permettre de créer un utilisateur", async () => {
    const res = await request(app)
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        birthDate: "1990-01-01",
        city: "Paris",
        postalCode: "75001"
      });
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("Utilisateur créé avec succès.");
  });

  it("Devrait récupérer la liste des utilisateurs créés par l'administrateur", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const user = res.body.find(u => u.email === "john.doe@example.com");
    expect(user).toBeDefined();
  });

  it("Devrait refuser l'accès aux endpoints protégés si aucun token n'est fourni", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
    expect(res.body.msg).toContain("Accès non autorisé");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
