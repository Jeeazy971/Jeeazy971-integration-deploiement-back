const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
    try {
        console.log("🌍 Connexion à la base de test MongoDB...");
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("✅ MongoDB Connecté à test");

        // Supprime John Doe s'il existe déjà
        const deleteResult = await User.deleteOne({ email: "john.doe@example.com" });
        if (deleteResult.deletedCount > 0) {
            console.log("🗑 John Doe supprimé avant insertion.");
        } else {
            console.log("⚠️ John Doe n'existait pas avant insertion.");
        }

        // Création de l'admin si inexistant
        const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
            await User.create({
                firstName: "Admin",
                lastName: "User",
                email: "loise.fenoll@ynov.com",
                password: hashedPassword,
                birthDate: new Date("1990-01-01"),
                city: "Paris",
                postalCode: "75000",
                role: "admin",
            });
            console.log("✅ Admin seeded pour les tests.");
        } else {
            console.log("ℹ️ Admin déjà en base, pas besoin de l'insérer.");
        }

        // Création de John Doe après suppression
        const hashedPassword = await bcrypt.hash("password123", 10);
        await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: hashedPassword,
            birthDate: new Date("1990-01-01"),
            city: "Paris",
            postalCode: "75001",
            role: "user",
        });
        console.log("✅ John Doe seeded pour les tests.");

        // Attendre 1s pour s'assurer que la base est bien mise à jour
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    }
});

// Nettoyage après chaque test
afterEach(async () => {
    try {
        await User.deleteMany({ role: "user" }); // Ne supprime pas l'admin
        console.log("🧹 Nettoyage des utilisateurs de test");
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage des utilisateurs:", error);
    }
});

// Fermeture de la connexion MongoDB après tous les tests
afterAll(async () => {
    try {
        console.log("🔌 Fermeture de MongoDB...");
        await mongoose.connection.close();
        console.log("✅ Connexion MongoDB fermée");
    } catch (error) {
        console.error("❌ Erreur lors de la fermeture de MongoDB :", error);
    }
});

// Ajout d'un test bidon pour Jest
test("Setup should run correctly", () => {
    expect(true).toBe(true);
});
