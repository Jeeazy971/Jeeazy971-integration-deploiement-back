module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"], // 🔥 Charge `setup.js` avant les tests
    testTimeout: 10000, // 🔥 Augmente le timeout si nécessaire
};
