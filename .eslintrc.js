module.exports = {
  extends: [
      'last',
      'prettier/react',
      'plugin:react/recommended',
      'plugin:jest/recommended'
  ], // extending recommended config and config derived from eslint-config-prettier
  plugins: [
      'prettier',
      'flowtype',
      'jest'
  ], // activating esling-plugin-prettier (--fix stuff)
    "env": {
        "browser": true,
        "node": true,
        "jest": true
    },
  rules: {
    'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        singleQuote: true,
          tabWidth: 4
      },
    ],
    eqeqeq: ['error', 'always'], // adding some custom ESLint rules
  },
};