// tests/unit/publicController.test.js
const publicController = require("../../src/controllers/publicController");
const User = require("../../src/models/User");
jest.mock("../../src/models/User");

describe("publicController.registerUser", () => {
    let req, res;
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("retourne 400 si des champs sont manquants", async () => {
        req.body = { firstName: "Alice", email: "alice@example.com" };
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Tous les champs sont requis." });
    });

    test("retourne 400 si le prénom est invalide", async () => {
        req.body = { firstName: "Alice123", lastName: "Test", email: "alice@example.com", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" };
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Le prénom n'est pas valide." });
    });

    test("retourne 400 si l'email est invalide", async () => {
        req.body = { firstName: "Alice", lastName: "Test", email: "invalid", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" };
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "L'email n'est pas valide." });
    });

    test("retourne 400 si le code postal est invalide", async () => {
        req.body = { firstName: "Alice", lastName: "Test", email: "alice@example.com", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "ABC" };
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Le code postal n'est pas valide." });
    });

    test("retourne 400 si l'utilisateur est mineur", async () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate()).toISOString().split("T")[0];
        req.body = { firstName: "Alice", lastName: "Test", email: "alice@example.com", password: "pass", birthDate, city: "Paris", postalCode: "75001" };
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Vous devez être majeur pour vous inscrire." });
    });

    test("retourne 400 si un utilisateur avec cet email existe déjà", async () => {
        req.body = { firstName: "Alice", lastName: "Test", email: "alice@example.com", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" };
        User.findOne.mockResolvedValue({ _id: "exists" });
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Un utilisateur avec cet email existe déjà." });
    });

    test("inscrit un utilisateur avec succès", async () => {
        req.body = { firstName: "Alice", lastName: "Test", email: "alice@example.com", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" };
        User.findOne.mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue();
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: "Inscription réussie." });
    });

    test("gère les erreurs dans registerUser", async () => {
        req.body = { firstName: "Alice", lastName: "Test", email: "alice@example.com", password: "pass", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" };
        User.findOne.mockRejectedValue(new Error("Error"));
        await publicController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur." });
    });
});

describe("publicController.getPublicUsers", () => {
    let req, res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("retourne la liste publique sans email ni birthDate", async () => {
        const fakeUsers = [
            { _id: "1", firstName: "Alice", lastName: "Test", email: "alice@example.com", birthDate: "1990-01-01", city: "Paris", postalCode: "75001" },
            { _id: "2", firstName: "Bob", lastName: "Test", email: "bob@example.com", birthDate: "1985-01-01", city: "Lyon", postalCode: "69000" }
        ];
        // Simuler la projection réalisée dans la requête MongoDB
        const projectedUsers = fakeUsers.map(user => {
            const { email, birthDate, ...rest } = user;
            return rest;
        });
        User.find.mockResolvedValue(projectedUsers);
        await publicController.getPublicUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        const returnedUsers = res.json.mock.calls[0][0];
        returnedUsers.forEach(user => {
            expect(user.email).toBeUndefined();
            expect(user.birthDate).toBeUndefined();
        });
    });

    test("gère les erreurs dans getPublicUsers", async () => {
        User.find.mockRejectedValue(new Error("Error"));
        await publicController.getPublicUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur." });
    });
});
