module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-navigation/elements|@react-navigation/native|@react-native(- community)?)/)',
  ],
};
