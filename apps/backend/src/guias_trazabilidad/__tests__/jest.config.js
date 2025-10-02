module.exports = {
  displayName: 'GuiasTrazabilidad',
  testMatch: [
    '<rootDir>/src/guias_trazabilidad/__tests__/**/*.spec.ts'
  ],
  collectCoverageFrom: [
    'src/guias_trazabilidad/**/*.ts',
    '!src/guias_trazabilidad/**/*.spec.ts',
    '!src/guias_trazabilidad/**/*.interface.ts',
    '!src/guias_trazabilidad/**/*.dto.ts',
    '!src/guias_trazabilidad/__tests__/**/*'
  ],
  coverageDirectory: 'coverage/guias_trazabilidad',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../..',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/guias_trazabilidad/__tests__/setup/jest.setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};