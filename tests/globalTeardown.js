// tests/globalTeardown.js
const mongoose = require("mongoose");

module.exports = async () => {
  // Attendre un court instant pour s'assurer que tous les timers sont terminés
  await new Promise(resolve => setTimeout(resolve, 1000));
  await mongoose.disconnect();
  console.log("Déconnexion globale effectuée (globalTeardown)");
};
