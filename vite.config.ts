import { defineConfig } from "vite"; // подключаем инструмент Vite для настройки проекта
import react from "@vitejs/plugin-react"; // подключаем плагин для работы с React
import tailwindcss from "@tailwindcss/vite"; // подключаем плагин для работы с Tailwind CSS (инструмент для стилей)

// https://vite.dev/config/
export default defineConfig({
  // экспортируем настройки проекта
  base: "/OncoSreenTest/", // указываем путь где будет лежать проект на интернете
  plugins: [tailwindcss(), react()], // активируем плагины Tailwind и React
});
