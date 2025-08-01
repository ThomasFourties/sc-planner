module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.service.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts'
  ],
  coverageDirectory: './coverage',
  moduleNameMapping: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};