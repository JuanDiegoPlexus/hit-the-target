import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"], // Configuración para archivos TypeScript
    languageOptions: {
      parser: tsParser, // Usa el parser de TypeScript
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin, // Plugin para TypeScript
      prettier: pluginPrettier, // Plugin para Prettier
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // Reglas recomendadas para TypeScript
      ...prettierConfig.rules, // Reglas de Prettier
      "prettier/prettier": "error", // Muestra errores si el código no sigue las reglas de Prettier
      "@typescript-eslint/no-unused-vars": "warn", // Ejemplo de regla adicional
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"], // Configuración para archivos JavaScript
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: pluginPrettier, // Plugin para Prettier
    },
    rules: {
      ...prettierConfig.rules, // Reglas de Prettier
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
    },
  },
]);