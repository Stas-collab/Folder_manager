module.exports = {
    testEnvironment: 'jsdom', // Вказуємо, що середовище - це браузер
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
};
