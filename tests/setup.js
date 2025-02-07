const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
    try {
        console.log("🌍 Connexion à la base de test MongoDB...");

        if (!process.env.MONGO_URI_TEST) {
            throw new Error("❌ Erreur : MONGO_URI_TEST n'est pas défini !");
        }

        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connecté à test");

        // Vérifie si l'admin est déjà en base
        const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
            await User.create({
                firstName: "Admin",
                lastName: "User",
                email: "loise.fenoll@ynov.com",
                password: hashedPassword,
                birthDate: new Date("1990-01-01"),
                city: "TestCity",
                postalCode: "00000",
                role: "admin",
            });
            console.log("✅ Admin seeded pour les tests");
        } else {
            console.log("ℹ️ Admin déjà en base, pas besoin de l'insérer.");
        }

        // Vérifie si John Doe est déjà en base
        const existingUser = await User.findOne({ email: "john.doe@example.com" });
        if (!existingUser) {
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
            console.log("✅ John Doe seeded pour les tests");
        }

    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    }
});

// Nettoyage des utilisateurs après chaque test
afterEach(async () => {
    try {
        await User.deleteMany({ role: "user" }); // Ne supprime pas l'admin
        console.log("🧹 Nettoyage des utilisateurs de test");
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage des utilisateurs:", error);
    }
});

// Fermeture propre de la connexion après tous les tests
afterAll(async () => {
    try {
        console.log("🔌 Fermeture de MongoDB...");
        await mongoose.connection.close();
        console.log("✅ Connexion MongoDB fermée");
    } catch (error) {
        console.error("❌ Erreur lors de la fermeture de MongoDB :", error);
    }
});
