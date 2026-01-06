const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Only run Jest tests (unit tests), exclude Playwright tests
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '!**/__tests__/**/*.spec.ts',
    '!**/__tests__/integration/**',
    '!**/__tests__/e2e/**',
    '!**/__tests__/utils/test-helpers.ts',
  ],
  collectCoverageFrom: [
    'lib/utils/cpf.ts',
    'lib/utils/calculos.ts',
    '!lib/utils/**/*.d.ts',
    '!**/*.config.{js,ts}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

