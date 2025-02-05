module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setupDB.js"], // 🔥 Charge `setupDB.js` avant les tests
    testTimeout: 10000,
    testMatch: ["**/tests/!(validation.test).js"],  // Ignore validation.test.js
};
