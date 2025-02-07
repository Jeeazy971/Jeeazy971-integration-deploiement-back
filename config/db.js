// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Définir NODE_ENV s'il n'est pas déjà défini
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Choisir le fichier d'environnement à charger
let envFile = ".env";
if (process.env.ENV_FILE) {
  envFile = process.env.ENV_FILE;
} else if (process.env.NODE_ENV === "test") {
  envFile = ".env.test";
}

dotenv.config({ path: envFile });
console.log(`Chargement des variables d'environnement depuis ${envFile}`);

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("L'URI de MongoDB n'est pas définie");
    }
    console.log(`🌍 Connexion aux ${process.env.NODE_ENV} MongoDB avec URI: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connecté à ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    if (process.env.NODE_ENV !== "test") process.exit(1);
    throw error;
  }
};

module.exports = connectDB;
