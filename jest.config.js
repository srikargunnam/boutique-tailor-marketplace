module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|nativewind)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/__tests__/**",
  ],
};
