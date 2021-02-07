module.exports = {
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx)', '**/?(*.)+(spec|test).+(ts|tsx)'],
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['<rootDir>/jest.config.js'],
}
