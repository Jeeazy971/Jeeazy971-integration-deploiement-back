// seed.js
const connectDB = require("./config/db");
const User = require("./src/models/User");

const seedAdmin = async () => {
  try {
    await connectDB();
    const adminEmail = "loise.fenoll@ynov.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin déjà présent");
    } else {
      const admin = new User({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: "ANKymoUTFu4rbybmQ9Mt",
        birthDate: new Date("1990-01-01"),
        city: "Paris",
        postalCode: "75000",
        role: "admin"
      });
      await admin.save();
      console.log("✅ Admin inséré avec succès");
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur de seed:", error);
    process.exit(1);
  }
};

seedAdmin();
