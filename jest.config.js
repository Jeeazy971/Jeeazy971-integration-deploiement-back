// jest.config.js
module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    testPathIgnorePatterns: ["/tests/setupDB.js"],
    testTimeout: 5000,
    globalSetup: "./tests/globalSetup.js",
    globalTeardown: "./tests/globalTeardown.js"
};
