// tests/user.test.js
const request = require("supertest");
const app = require("../server");

let token;

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "loise.fenoll@ynov.com", password: "ANKymoUTFu4rbybmQ9Mt" });
  token = loginRes.body.token;
  expect(token).toBeDefined();
});

describe("Tests de gestion des utilisateurs", () => {
  it("Devrait permettre de créer un utilisateur", async () => {
    const res = await request(app)
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Alice",
        lastName: "Test",
        email: "alice.test@example.com",
        password: "test123",
        birthDate: "1992-06-15",
        city: "Lyon",
        postalCode: "69000"
      });
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("Utilisateur créé avec succès.");
  });

  it("Devrait récupérer la liste des utilisateurs", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Devrait supprimer un utilisateur existant", async () => {
    const userRes = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(userRes.body.length).toBeGreaterThan(0);

    const userId = userRes.body[0]._id;
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
