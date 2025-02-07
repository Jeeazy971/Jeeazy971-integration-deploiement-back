module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setupValidation.js"],
    testTimeout: 5000,
    testMatch: ["**/tests/validation.test.js"],
};
