module.exports = {
  'extends': 'airbnb',
  'plugins': [
    'react',
    'jsx-a11y',
    'import'
  ],
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  'parser': 'babel-eslint',
  'rules': {
    'semi': ['error', 'never'],
    'import/no-unresolved': [2, { 'ignore': ['views/.*', 'reselect', 'react-*'] }],
    'react/jsx-filename-extension': 'off',
    'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
    'import/extensions': ['error', { 'es': 'never' }],
    'import/no-extraneous-dependencies': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-confusing-arrow': ['error', {'allowParens': true}],
    'import/prefer-default-export': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': ['error', { 'allow': ['__'] }],
    'no-console': ['error', { "allow": ["warn", "error"] }],
    'space-in-parens': 'off',
    'object-curly-spacing': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-indent-props': 'off',
    'space-unary-ops': 'off',
    'object-property-newline': 'off',
    'space-infix-ops': 'off',
    'curly': 'off',
    'quotes': 'off',
    'comma-spacing': 'off',
    'array-callback-return': 'off',
    'no-nested-ternary': 'off',
    'no-confusing-arrow': 'off',
    'no-else-return': 'off',
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/jsx-boolean-value': 'off',
    'no-mixed-operators': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off'
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.es'],
        'paths': [__dirname],
      },
    },
    'import/core-modules': [
      'bluebird',
      'electron',
      'react',
      'react-redux',
      'redux-observers',
      'reselect',
      'react-bootstrap',
      'react-fontawesome',
      'path-extra',
      'fs-extra',
      'lodash',
      'cson',
      'react-dom',
      'redux',
      'semver',
      'i18n-2'
    ],
  },
}
