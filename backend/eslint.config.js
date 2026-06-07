const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Απαραίτητο αφού χρησιμοποιείς Jest για τα τεστ σου
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off', // Στο backend συνήθως χρειαζόμαστε την console
    },
  },
];