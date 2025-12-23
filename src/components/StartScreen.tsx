// Framer Motion — плавное появление/исчезновение стартового экрана
import { motion } from "framer-motion";

// Пропсы компонента: колбэк, который сообщает родителю, какой тест выбран
type Props = {
  onSelect: (screen: "cervical" | "breast") => void;
};

// Стартовый экран: две кнопки выбора теста
export function StartScreen({ onSelect }: Props) {
  return (
    // Контейнер с анимацией появления/исчезновения
    <motion.div
      initial={{ opacity: 0 }} // стартовое состояние
      animate={{ opacity: 1 }} // состояние при показе
      exit={{ opacity: 0 }} // состояние при уходе
      transition={{ duration: 0.25 }} // скорость анимации
      className="w-full"
    >
      {/* Вертикальная колонка кнопок */}
      <div className="flex flex-col gap-4">
        {/* Кнопка выбора теста шейки матки */}
        <button
          onClick={() => onSelect("cervical")} // сообщаем родителю выбранный экран
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак шейки матки
        </button>

        {/* Кнопка выбора теста молочной железы */}
        <button
          onClick={() => onSelect("breast")} // сообщаем родителю выбранный экран
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак молочной железы
        </button>
      </div>
    </motion.div>
  );
}
