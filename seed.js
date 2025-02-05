const connectDB = require("./config/db");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    await connectDB();
    const adminEmail = "loise.fenoll@ynov.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin déjà présent");
    } else {
      const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
      const admin = new User({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: hashedPassword,
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
