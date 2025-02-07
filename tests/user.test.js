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
    console.log("🔑 Token récupéré :", token);
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

    console.log("🛠 Résultat création utilisateur :", res.body);
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("Utilisateur créé avec succès.");
  });

  it("Devrait récupérer la liste des utilisateurs", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    console.log("🛠 Liste des utilisateurs récupérée :", res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const user = res.body.find(u => u.email === "john.doe@example.com");
      expect(user).toBeDefined();
    } else {
      console.log("⚠️ Aucun utilisateur trouvé !");
    }
  });

  it("Devrait supprimer un utilisateur existant", async () => {
    const userRes = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    console.log("🛠 Liste des utilisateurs avant suppression :", userRes.body);

    if (userRes.body.length === 0) {
      console.log("⚠️ Aucun utilisateur à supprimer !");
      return;
    }

    const userId = userRes.body[0]._id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Utilisateur supprimé avec succès");
  });

  afterAll(async () => {
    console.log("🧹 Nettoyage de la base de test...");
    await mongoose.connection.close();
    console.log("✅ Connexion MongoDB fermée.");
  });
});
