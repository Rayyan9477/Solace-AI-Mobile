module.exports = {
  extends: ['universe/native'],
  rules: {
    // Disable some rules that are too strict for this mental health app
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': 'off',
    'react/display-name': 'off',
    'no-console': 'off', // Allow console for debugging mental health features
    'prettier/prettier': 'off', // Disable prettier conflicts for now
  },
};