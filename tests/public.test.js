// tests/public.test.js
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../src/models/User");

describe("Tests des endpoints publics", () => {
    beforeAll(async () => {
        // On s'assure que la connexion à la BDD de test est établie
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        // Nettoyage des utilisateurs de test pour avoir une base propre
        await User.deleteMany({ role: "user" });
    });

    afterAll(async () => {
        // Nettoyage final des utilisateurs de test
        await User.deleteMany({ role: "user" });
        await mongoose.disconnect();
    });

    test("Inscription publique avec données manquantes retourne une erreur", async () => {
        const res = await request(app)
            .post("/api/public/register")
            .send({ firstName: "Test", email: "test@example.com" });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Tous les champs sont requis.");
    });

    test("Inscription publique avec email invalide retourne une erreur", async () => {
        const res = await request(app)
            .post("/api/public/register")
            .send({
                firstName: "Test",
                lastName: "User",
                email: "invalid-email",
                password: "password123",
                birthDate: "2000-01-01",
                city: "Paris",
                postalCode: "75000",
            });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("L'email n'est pas valide.");
    });

    test("Inscription publique avec prénom invalide retourne une erreur", async () => {
        const res = await request(app)
            .post("/api/public/register")
            .send({
                firstName: "Test123",
                lastName: "User",
                email: "testuser@example.com",
                password: "password123",
                birthDate: "2000-01-01",
                city: "Paris",
                postalCode: "75000",
            });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Le prénom n'est pas valide.");
    });

    test("Inscription publique refusée pour les mineurs", async () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
            .toISOString()
            .split("T")[0];
        const res = await request(app)
            .post("/api/public/register")
            .send({
                firstName: "Young",
                lastName: "User",
                email: "younguser@example.com",
                password: "password123",
                birthDate,
                city: "Paris",
                postalCode: "75000",
            });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Vous devez être majeur pour vous inscrire.");
    });

    test("Inscription publique avec données valides", async () => {
        const res = await request(app)
            .post("/api/public/register")
            .send({
                firstName: "Alice",
                lastName: "Test",
                email: "alicetest@example.com",
                password: "password123",
                birthDate: "1990-01-01",
                city: "Lyon",
                postalCode: "69000",
            });
        expect(res.status).toBe(201);
        expect(res.body.msg).toBe("Inscription réussie.");
    });

    test("Inscription publique refusée pour email déjà utilisé", async () => {
        const res = await request(app)
            .post("/api/public/register")
            .send({
                firstName: "Alice",
                lastName: "Test",
                email: "alicetest@example.com",
                password: "password123",
                birthDate: "1990-01-01",
                city: "Lyon",
                postalCode: "69000",
            });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Un utilisateur avec cet email existe déjà.");
    });

    test("Récupération de la liste publique des inscrits sans email ni date de naissance", async () => {
        const res = await request(app).get("/api/public/users");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((user) => {
            expect(user.email).toBeUndefined();
            expect(user.birthDate).toBeUndefined();
        });
    });
});
