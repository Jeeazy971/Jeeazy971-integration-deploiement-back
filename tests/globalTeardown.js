const mongoose = require("mongoose");

module.exports = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  await mongoose.disconnect();
  console.log("Déconnexion globale effectuée (globalTeardown)");
};
