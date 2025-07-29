module.exports = {
  extends: ['universe/native'],
  rules: {
    // Relax some rules for React Native development
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    es6: true,
    node: true,
  },
};