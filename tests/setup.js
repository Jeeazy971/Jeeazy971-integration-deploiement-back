const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test";

beforeAll(async () => {
    try {
        console.log("🌍 Connexion à la base de test MongoDB...");
        if (!MONGO_URI) {
            throw new Error("❌ MONGO_URI_TEST n'est pas défini !");
        }

        await mongoose.connect(MONGO_URI, { connectTimeoutMS: 20000 });
        console.log("✅ MongoDB Connecté à test");

        // Attendre que la connexion soit bien active
        while (mongoose.connection.readyState !== 1) {
            console.log("⏳ En attente de la connexion MongoDB...");
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log("🔄 Vérification et suppression de John Doe...");
        await User.deleteOne({ email: "john.doe@example.com" });

        const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });
        if (!existingAdmin) {
            console.log("✅ Ajout de l'admin de test");
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
        } else {
            console.log("ℹ️ Admin déjà en base.");
        }

        console.log("✅ Ajout de John Doe");
        const hashedPassword = await bcrypt.hash("password123", 10);
        await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: hashedPassword,
            birthDate: "1990-01-01",
            city: "Paris",
            postalCode: "75001",
            role: "user",
        });

        // Pause pour s'assurer que les données sont bien enregistrées
        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
        process.exit(1);
    }
});

// Nettoyage après chaque test
afterEach(async () => {
    try {
        console.log("🧹 Suppression des utilisateurs de test...");
        await User.deleteMany({ role: "user" });
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage des utilisateurs :", error);
    }
});

// Fermeture de la connexion après les tests
afterAll(async () => {
    try {
        console.log("🔌 Fermeture de MongoDB...");
        await mongoose.connection.close();
        console.log("✅ Connexion MongoDB fermée");
    } catch (error) {
        console.error("❌ Erreur lors de la fermeture de MongoDB :", error);
    }
});

// Ajout d'un test factice pour Jest
test("Setup should run correctly", () => {
    expect(true).toBe(true);
});
