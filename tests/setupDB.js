// tests/setupDB.js
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

async function runSetup() {
    try {
        console.log("🌍 Connexion à la base de test MongoDB...");

        if (!process.env.MONGO_URI_TEST) {
            throw new Error("❌ Erreur : MONGO_URI_TEST n'est pas défini !");
        }

        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("✅ MongoDB Connecté à test");

        console.log("🧹 Suppression des anciens utilisateurs...");
        await User.deleteMany({});

        // Création de l'admin
        const hashedPasswordAdmin = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
        await User.create({
            firstName: "Admin",
            lastName: "User",
            email: "loise.fenoll@ynov.com",
            password: hashedPasswordAdmin,
            birthDate: new Date("1990-01-01"),
            city: "TestCity",
            postalCode: "00000",
            role: "admin",
        });
        console.log("✅ Admin ajouté.");

        // Création de John Doe
        const hashedPasswordUser = await bcrypt.hash("password123", 10);
        await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: hashedPasswordUser,
            birthDate: new Date("1990-01-01"),
            city: "Paris",
            postalCode: "75001",
            role: "user",
        });
        console.log("✅ John Doe ajouté.");
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    } finally {
        console.log("🔌 Fermeture de MongoDB...");
        await mongoose.connection.close();
        console.log("✅ Connexion MongoDB fermée");
    }
}

if (require.main === module) {
    runSetup();
}

module.exports = runSetup;
