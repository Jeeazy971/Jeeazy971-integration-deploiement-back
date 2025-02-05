const request = require("supertest");
const app = require("../app");

describe("Test Gestion Utilisateurs", () => {
  let token;
  
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "hashedpassword"
    });
    token = res.body.token;
  });

  it("Devrait permettre à un admin de créer un utilisateur", async () => {
    const res = await request(app)
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "testpassword",
        birthDate: "2000-01-01",
        city: "TestCity",
        postalCode: "12345",
        role: "user"
      });

    console.log("Response Body:", res.body);
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("Utilisateur user créé avec succès.");
  });
});
