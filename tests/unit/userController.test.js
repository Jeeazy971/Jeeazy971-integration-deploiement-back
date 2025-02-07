// tests/unit/userController.test.js
const userController = require("../../src/controllers/userController");
const User = require("../../src/models/User");
jest.mock("../../src/models/User");

describe("userController.createUser", () => {
    let req, res;
    beforeEach(() => {
        req = { user: { id: "admin123", role: "admin" }, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("retourne 403 si l'utilisateur n'est pas admin", async () => {
        req.user = { id: "user", role: "user" };
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Accès interdit" });
    });

    test("retourne 400 si l'utilisateur existe déjà", async () => {
        req.body = {
            firstName: "Alice",
            lastName: "Test",
            email: "alice@example.com",
            password: "pass",
            birthDate: "1990-01-01",
            city: "Paris",
            postalCode: "75001"
        };
        User.findOne.mockResolvedValue({ _id: "exists" });
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Utilisateur existe déjà" });
    });

    test("crée un utilisateur avec succès", async () => {
        req.body = {
            firstName: "Alice",
            lastName: "Test",
            email: "alice@example.com",
            password: "pass",
            birthDate: "1990-01-01",
            city: "Paris",
            postalCode: "75001"
        };
        User.findOne.mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue();
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: "Utilisateur créé avec succès." });
    });

    test("gère les erreurs dans createUser", async () => {
        req.body = {
            firstName: "Alice",
            lastName: "Test",
            email: "alice@example.com",
            password: "pass",
            birthDate: "1990-01-01",
            city: "Paris",
            postalCode: "75001"
        };
        User.findOne.mockRejectedValue(new Error("Error"));
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur" });
    });
});

describe("userController.getUsers", () => {
    let req, res;
    beforeEach(() => {
        req = { user: { id: "admin123", role: "admin" } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("récupère la liste des utilisateurs", async () => {
        const fakeUsers = [{ _id: "1" }, { _id: "2" }];
        User.find.mockResolvedValue(fakeUsers);
        await userController.getUsers(req, res);
        expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });

    test("gère les erreurs dans getUsers", async () => {
        User.find.mockRejectedValue(new Error("Error"));
        await userController.getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur" });
    });
});

describe("userController.deleteUser", () => {
    let req, res;
    beforeEach(() => {
        req = { user: { id: "admin123", role: "admin" }, params: { id: "user1" } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("retourne 404 si l'utilisateur n'est pas trouvé", async () => {
        User.findOneAndDelete.mockResolvedValue(null);
        await userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Utilisateur non trouvé ou non autorisé à être supprimé" });
    });

    test("supprime l'utilisateur avec succès", async () => {
        User.findOneAndDelete.mockResolvedValue({ _id: "user1" });
        await userController.deleteUser(req, res);
        expect(res.json).toHaveBeenCalledWith({ msg: "Utilisateur supprimé avec succès" });
    });

    test("gère les erreurs dans deleteUser", async () => {
        User.findOneAndDelete.mockRejectedValue(new Error("Error"));
        await userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur" });
    });
});

describe("userController.getAdmins", () => {
    let req, res;
    beforeEach(() => {
        req = { user: { id: "admin123", role: "admin" } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("récupère la liste des administrateurs", async () => {
        const fakeAdmins = [{ _id: "a1" }, { _id: "a2" }];
        User.find.mockResolvedValue(fakeAdmins);
        await userController.getAdmins(req, res);
        expect(res.json).toHaveBeenCalledWith(fakeAdmins);
    });

    test("gère les erreurs dans getAdmins", async () => {
        User.find.mockRejectedValue(new Error("Error"));
        await userController.getAdmins(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur" });
    });
});
