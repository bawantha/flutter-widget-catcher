module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  globals: {
    chrome: 'readonly'
  },
  rules: {
    // Customize rules for Chrome extension development
    'no-unused-vars': ['error', { 
      'varsIgnorePattern': '^_',
      'argsIgnorePattern': '^_' 
    }],
    'no-console': 'off', // Allow console.log for debugging in extensions
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'indent': ['error', 2],
    'max-len': ['warn', { 'code': 120 }],
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true
      }
    }
  ]
}; 