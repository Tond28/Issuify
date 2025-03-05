import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.recommended,
      ...tseslint.configs.recommended.rules,

      "@typescript-eslint/no-unused-vars": "warn",
      "semi": ["error", "never"],
      "quotes": ["error", "double"],
      "eqeqeq": "error",
      "indent": ["error", 2],
      "no-trailing-spaces": ["error", { "skipBlankLines": true }],
      "no-multiple-empty-lines": ["error"],
      "no-multi-spaces": ["error"],
    },
  },
]
