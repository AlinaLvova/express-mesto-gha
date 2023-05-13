module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-base',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'linebreak-style': 'off',
  },
};
