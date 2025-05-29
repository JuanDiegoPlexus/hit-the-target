const htmlPlugin = require('@html-eslint/eslint-plugin');
const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintParserTs = require('@typescript-eslint/parser');
const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**/*', 'projects/**/*'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      '@angular-eslint': angularEslintPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-console': ['error', { allow: ['error'] }],
      'no-debugger': 'error',
      'no-warning-comments': ['error'],
      'no-inline-comments': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-function': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
      '@html-eslint': htmlPlugin,
    },
    rules: {
      '@angular-eslint/template/no-any': 'error',
    },
  },
];
