import "./App.css"; // подключаем стили для компонента App

import QuestionBlock from "./components/QuestionBlock"; // подключаем компонент QuestionBlock из папки components

function App() {
  // создаем главный компонент приложения
  return (
    // возвращаем что нарисовать на странице
    <QuestionBlock /> // выводим компонент QuestionBlock на страницу
  );
}

export default App; // экспортируем компонент App чтобы его можно было использовать в других местах
