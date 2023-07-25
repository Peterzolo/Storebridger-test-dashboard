module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  transformIgnorePatterns: ['node_modules/(?!troublesome-dependency/.*)'],
  moduleNameMapper: {
    '@bff/(.*)': '<rootDir>/src/$1',
    '@mock/(.*)': '<rootDir>/test/__mocks__/$1',
  },
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.ts',
  //   '!<rootDir>/src/**/*.module.ts',
  //   '!<rootDir>/src/**/*.d.ts',
  //   '!<rootDir>/src/**/*.spec.ts',
  //   '!<rootDir>/src/**/*.test.ts',
  //   '!<rootDir>/src/**/__*__/*',
  //   '!<rootDir>/src/**/server.ts',
  //   '!<rootDir>/src/**/inversify.config.ts',
  // ],
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};
