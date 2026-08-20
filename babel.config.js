// This config is only used for local tooling (jest, eslint's @babel/eslint-parser).
// When this plugin runs inside poi, poi loads .es files through its own
// babel-hook and its own babel.config.js, so this file has no effect on
// production behavior.
module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports'),
  ],
  compact: false,
}
