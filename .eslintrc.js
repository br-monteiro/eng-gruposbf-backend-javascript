module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    mocha: true,
    browser: true,
    node: true,
  },
  globals: {},
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    // Required to avoid no-semicolon
    semi: ['error', 'never'],
    // Required to avoid JS crazy things
    complexity: ['error', 7],
    // Required to avoid no-semicolon JS gotchas
    'no-unexpected-multiline': 'error',
    // Since ES2015, function names are not required for debugging
    'func-names': ['error', 'never'],
    // Allow empty comment lines
    'spaced-comment': ['off'],
    // Allow underscore prefix to indicate private methods
    'no-underscore-dangle': ['off'],
    // Allows unused variables when prefixed by an `underscore`
    'no-unused-vars': ['error', { argsIgnorePattern: '^_|^h$', ignoreRestSiblings: true }],
    'no-unused-expressions': ['error'],
    // This emits some linebreak errors into windows env (if settled as `windows`)
    'linebreak-style': 0,
    // allow debugger during development
    // prevent two empty lines
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-extra-boolean-cast': ['off'],
    'no-param-reassign': ['off'],
    'no-use-before-define': 'off',
    'semi-style': ['error'],
    indent: ['error', 2],
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    'no-multi-spaces': 'error',
    'no-undef': ['error', { typeof: true }],
    'space-before-function-paren': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'quote-props': ['error', 'as-needed']
  },
}
