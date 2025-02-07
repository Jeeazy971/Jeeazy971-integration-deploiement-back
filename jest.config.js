// jest.config.js
module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    testPathIgnorePatterns: ["/tests/setupDB.js"],
    testTimeout: 5000
};
