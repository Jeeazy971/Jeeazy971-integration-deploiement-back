// tests/globalTeardown.js
const mongoose = require("mongoose");

module.exports = async () => {
    await mongoose.disconnect();
    console.log("Déconnexion globale effectuée (globalTeardown)");
};
