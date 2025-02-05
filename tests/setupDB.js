const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);

        // Supprime l'admin existant pour éviter la duplication
        await User.deleteOne({ email: "loise.fenoll@ynov.com" });

        const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
        await User.create({
            firstName: "Admin",
            lastName: "User",
            email: "loise.fenoll@ynov.com",
            password: hashedPassword,
            birthDate: new Date("1990-01-01"),
            city: "TestCity",
            postalCode: "00000",
            role: "admin"
        });
        console.log("✅ Admin seeded for tests");
    } catch (error) {
        console.error("Erreur lors du seed de l'admin :", error);
    }
});

// Nettoyage des utilisateurs créés après chaque test
afterEach(async () => {
    try {
        await User.deleteMany({ role: "user" });
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage des utilisateurs:", error);
    }
});

// Fermeture de la connexion MongoDB après tous les tests
afterAll(async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("✅ Connexion MongoDB fermée après les tests");
    } catch (error) {
        console.error("❌ Erreur lors de la fermeture de MongoDB :", error);
    }
});
