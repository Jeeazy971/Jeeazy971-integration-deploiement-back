// tests/unit/authMiddleware.test.js
const { authMiddleware } = require("../../src/middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

describe("authMiddleware", () => {
    let req, res, next;
    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    test("retourne 401 si le header Authorization est absent", () => {
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "Accès non autorisé, token manquant" });
    });

    test("retourne 401 si le token est invalide", () => {
        req.headers.authorization = "Bearer invalidtoken";
        jwt.verify = jest.fn(() => { throw new Error("invalid token"); });
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "Token invalide" });
    });

    test("appelle next() si le token est valide", () => {
        req.headers.authorization = "Bearer validtoken";
        const decoded = { id: "user1", role: "admin" };
        jwt.verify = jest.fn().mockReturnValue(decoded);
        authMiddleware(req, res, next);
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });
});
