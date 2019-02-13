module.exports = {
  extends: ['plugin:prettier/recommended', 'prettier', 'airbnb-base'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'operator-linebreak': 0,
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'object-curly-newline': 0,
    'arrow-parens': 0,
  },
  globals: {
    App: true,
    getApp: true,
    wx: true,
    Page: true,
    Component: true,
  },
};
