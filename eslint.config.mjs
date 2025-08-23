// @ts-check
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";


export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      prettier
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      'prettier/prettier': 'error',
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn"
    }
  }
);