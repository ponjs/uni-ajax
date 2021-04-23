module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  globals: {
    uni: true
  },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'error'
  },
  ignorePatterns: ['dist', 'unpackage', 'uni_modules', '*.d.ts']
}
