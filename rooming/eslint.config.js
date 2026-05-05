import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // any 타입을 빨간 에러가 아니라 노란 경고로 표시
      "@typescript-eslint/no-explicit-any": "warn",

      // 사용하지 않는 변수/파라미터도 에러 대신 경고로 표시
      "@typescript-eslint/no-unused-vars": "warn",

      // Vite React Refresh 관련 export 제한도 경고로 완화
      "react-refresh/only-export-components": "warn",
    },
  },
]);