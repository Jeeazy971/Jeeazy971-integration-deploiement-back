const request = require("supertest");
const app = require("../app");

describe("Test API Auth", () => {
  it("Devrait retourner une erreur 400 si login incorrect", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "inexistant@example.com",
      password: "wrongpassword"
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Utilisateur non trouvé");
  });
});
