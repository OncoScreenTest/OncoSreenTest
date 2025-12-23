import js from "@eslint/js"; // подключаем базовые правила проверки кода
import globals from "globals"; // подключаем переменные для браузера
import reactHooks from "eslint-plugin-react-hooks"; // подключаем правила для React Hooks
import reactRefresh from "eslint-plugin-react-refresh"; // подключаем правила для быстрой перезагрузки React
import tseslint from "typescript-eslint"; // подключаем правила для TypeScript
import { globalIgnores } from "eslint/config"; // подключаем функцию чтобы исключить файлы из проверки

export default tseslint.config([
  // экспортируем конфигурацию для проверки кода
  globalIgnores(["dist"]), // исключаем папку dist из проверки (там хранится собранный проект)

  {
    // открываем блок с основными правилами
    files: ["**/*.{ts,tsx}"], // эти правила применяются к файлам TypeScript и React
    extends: [
      // подключаем разные наборы правил проверки
      js.configs.recommended, // базовые правила для JavaScript
      tseslint.configs.recommended, // правила для TypeScript
      reactHooks.configs["recommended-latest"], // правила для React Hooks
      reactRefresh.configs.vite, // правила для быстрой перезагрузки в Vite
    ],

    languageOptions: {
      // настройки для языка программирования
      ecmaVersion: 2020, // используем стандарт JavaScript 2020
      globals: globals.browser, // указываем что используем браузер (window, document и т.д.)
    },
  },
]);
