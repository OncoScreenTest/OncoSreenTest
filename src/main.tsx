import { StrictMode } from "react"; // подключаем StrictMode из React (помогает найти проблемы в коде при разработке)

import { createRoot } from "react-dom/client"; // подключаем функцию для запуска React приложения в браузере

import "./index.css"; // подключаем глобальные стили

import App from "./App.tsx"; // подключаем главный компонент App

createRoot(document.getElementById("root")!).render(
  // находим элемент с id='root' в HTML и запускаем React приложение там
  <StrictMode>
    {" "}
    {/* включаем строгий режим для проверки ошибок */}
    <App /> {/* выводим главный компонент App */}
  </StrictMode>
); // закрываем функцию render
