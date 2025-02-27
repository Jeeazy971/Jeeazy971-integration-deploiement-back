// tests/unit/authController.test.js
const authController = require("../../src/controllers/authController");
const User = require("../../src/models/User");
const jwt = require("jsonwebtoken");

jest.mock("../../src/models/User");

describe("authController.login", () => {
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

    test("retourne 400 si email ou mot de passe manquant", async () => {
        req.body = { email: "", password: "" };
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Email et mot de passe sont requis." });
    });

    test("retourne 400 si l'utilisateur n'est pas trouvé", async () => {
        req.body = { email: "test@example.com", password: "pass" };
        User.findOne.mockResolvedValue(null);
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Utilisateur non trouvé." });
    });

    test("retourne 400 si le mot de passe est incorrect", async () => {
        req.body = { email: "test@example.com", password: "wrongpass" };
        const fakeUser = { comparePassword: jest.fn().mockResolvedValue(false), role: "admin" };
        User.findOne.mockResolvedValue(fakeUser);
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Mot de passe incorrect." });
    });

    test("retourne 403 si l'utilisateur n'est pas admin", async () => {
        req.body = { email: "test@example.com", password: "correct" };
        const fakeUser = { comparePassword: jest.fn().mockResolvedValue(true), role: "user" };
        User.findOne.mockResolvedValue(fakeUser);
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Accès réservé aux administrateurs." });
    });

    test("retourne un token si la connexion est réussie", async () => {
        req.body = { email: "test@example.com", password: "correct" };
        const fakeUser = { _id: "123", comparePassword: jest.fn().mockResolvedValue(true), role: "admin" };
        User.findOne.mockResolvedValue(fakeUser);
        jest.spyOn(jwt, "sign").mockReturnValue("fake-token");
        await authController.login(req, res);
        expect(res.json).toHaveBeenCalledWith({ token: "fake-token" });
    });

    test("gère les erreurs dans le bloc try/catch", async () => {
        req.body = { email: "test@example.com", password: "correct" };
        User.findOne.mockRejectedValue(new Error("Test error"));
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur." });
    });
});

describe("authController.registerAdmin", () => {
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

    test("retourne 400 si email ou mot de passe manquant", async () => {
        req.body = { email: "", password: "" };
        await authController.registerAdmin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Email et mot de passe sont requis." });
    });

    test("retourne 400 si un administrateur existe déjà", async () => {
        req.body = { email: "admin@example.com", password: "secret" };
        User.findOne.mockResolvedValue({ role: "admin" });
        await authController.registerAdmin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Un administrateur existe déjà." });
    });

    test("crée un administrateur avec succès", async () => {
        req.body = { email: "admin@example.com", password: "secret" };
        User.findOne.mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue();
        await authController.registerAdmin(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: "Administrateur créé avec succès." });
    });

    test("gère les erreurs lors de l'inscription de l'admin", async () => {
        req.body = { email: "admin@example.com", password: "secret" };
        User.findOne.mockRejectedValue(new Error("Error"));
        await authController.registerAdmin(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur." });
    });
});
