// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
// [config-inspector](https://eslint.org/blog/2024/04/eslint-config-inspector/) experience.
const eslintConfigPrettier = require('eslint-config-prettier/flat')

module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier,
  {
    ignores: ['dist/*'],
  },
])
