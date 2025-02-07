// tests/server.test.js
const request = require("supertest");
const app = require("../server");

describe("Server", () => {
    test("la racine redirige vers /api-docs", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/api-docs");
    });
});
