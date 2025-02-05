const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFile = process.env.ENV_FILE || (process.env.NODE_ENV === "test" ? ".env.test" : ".env");
dotenv.config({ path: envFile });

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;
    if (!mongoUri) throw new Error("L'URI de MongoDB n'est pas définie");

    console.log(`🌍 Connexion aux ${process.env.NODE_ENV} MongoDB avec URI: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connecté à ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    if (process.env.NODE_ENV !== "test") process.exit(1);
    throw error;
  }
};

module.exports = connectDB;
