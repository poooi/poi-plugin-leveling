module.exports = {
  transform: {
    '^.+\\.(es|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['es', 'js', 'json', 'node'],
  testMatch: ['<rootDir>/test/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/'],
}
