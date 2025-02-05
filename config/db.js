const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Si la variable ENV_FILE est définie, on l'utilise. Sinon, on charge selon NODE_ENV.
const envFile = process.env.ENV_FILE || (process.env.NODE_ENV === "test" ? ".env.test" : ".env");

dotenv.config({ path: envFile });

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

    console.log(`🌍 Connexion aux ${process.env.NODE_ENV} MongoDB avec URI: ${mongoUri}`);

    if (!mongoUri) {
      throw new Error("L'URI de MongoDB n'est pas défini");
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connecté à ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
