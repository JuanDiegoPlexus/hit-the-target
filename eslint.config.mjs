import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      prettier: pluginPrettier, // Define el plugin "prettier"
    },
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      ...prettierConfig.rules, // Aplica las reglas de Prettier directamente
      "prettier/prettier": "error", // Muestra errores si el código no sigue las reglas de Prettier
    },
  },
]);