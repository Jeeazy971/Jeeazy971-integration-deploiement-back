jest.setTimeout(30000);

const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Test de l'API principale", () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Devrait rediriger vers Swagger (API-docs)", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/api-docs");
  });
});
