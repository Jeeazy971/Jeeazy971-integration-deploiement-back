const mongoose = require("mongoose");
const User = require("./src/models/user.model");
require("dotenv").config();

const mongoUri = process.env.NODE_ENV === "test"
    ? "mongodb://admin:password@mongodb:27017/test?authSource=admin"
    : process.env.MONGO_URI;

console.log(`🔥 ENV DETECTÉ: ${process.env.NODE_ENV}`);
console.log(`🔗 MONGO_URI utilisée: ${mongoUri}`);

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connecté à ${mongoose.connection.name}`);

        // Vérifier si l'admin existe déjà
        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (!adminExists) {
            await User.create({
                email: "admin@example.com",
                password: "hashedpassword",
                role: "admin",
            });
            console.log("✅ Admin inséré !");
        } else {
            console.log("ℹ️ Admin déjà présent, seed ignoré.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur Seed:", error);
        process.exit(1);
    }
};

seedDatabase();
