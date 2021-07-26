module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  globals: {
    uni: 'readonly'
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    requireConfigFile: false,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error'
  },
  ignorePatterns: ['dist', 'unpackage', 'uni_modules', '*.d.ts']
}
