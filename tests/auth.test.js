const request = require("supertest");
const app = require("../app");

describe("Test Authentification", () => {
  it("Devrait permettre la connexion avec un admin valide", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@example.com", // même email que dans le seed
      password: "hashedpassword"  // la valeur attendue (si la DB est seedée avec ce mot de passe)
    });

    console.log("Response Body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
