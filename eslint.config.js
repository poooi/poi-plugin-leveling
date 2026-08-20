const path = require('path')
const js = require('@eslint/js')
const globals = require('globals')
const { fixupConfigRules } = require('@eslint/compat')
const reactPlugin = require('eslint-plugin-react')
const importXPlugin = require('eslint-plugin-import-x')
const babelParserImpl = require('@babel/eslint-parser')

// @babel/eslint-parser's scope manager uses eslint-scope v5, which lacks
// addGlobals() required by ESLint v10. Dropping the scope manager here makes
// ESLint fall back to its own (eslint-scope v9). See poi's eslint.config.mts
// for the same workaround.
const babelParser = {
  ...babelParserImpl,
  parseForESLint(...args) {
    const { scopeManager: _scopeManager, ...rest } = babelParserImpl.parseForESLint(...args)
    return rest
  },
}

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  js.configs.recommended,
  // eslint-plugin-react's rules still call the legacy context.getFilename()
  // API that ESLint 10 removed; fixupConfigRules patches that gap. See poi's
  // eslint.config.mts for the same workaround.
  ...fixupConfigRules([reactPlugin.configs.flat.recommended]),
  importXPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          configFile: path.join(__dirname, 'babel.config.js'),
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      // react isn't a dependency of this plugin: poi provides it at runtime.
      // Pin to the version poi currently ships (18.x) rather than 'detect'.
      react: {
        version: '18.3',
      },
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.es'],
          paths: [__dirname],
        },
      },
      'import-x/core-modules': [
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
        'i18n-2',
      ],
    },
    rules: {
      semi: ['error', 'never'],
      'react/prop-types': 'off',
      'react/jsx-filename-extension': 'off',
      'no-restricted-syntax': ['error', {
        selector: 'ExportDefaultDeclaration',
        message: 'Always use named exports',
      }],
      indent: ['error', 2, { flatTernaryExpressions: true }],
      'no-underscore-dangle': ['error', { allow: ['__', '__r', '__n'] }],
      'import-x/extensions': ['error', { es: 'never' }],
      'import-x/no-unresolved': ['error', { ignore: ['^views/', '^reselect$', '^react-', '^prop-types$'] }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-confusing-arrow': ['error', { allowParens: true }],
      'arrow-parens': ['error', 'as-needed'],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['error', {
        vars: 'all',
        varsIgnorePattern: '^_[a-zA-Z].*',
        args: 'all',
        argsIgnorePattern: '^_[a-zA-Z].*',
      }],
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]
