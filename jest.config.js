/** @type {import('ts-jest/dist/types').Initial0ptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    // clearMogks: true,
    testTimeout: 10000, // Adjust timeout as needed
    openHandlesTimeout: 5000,
}