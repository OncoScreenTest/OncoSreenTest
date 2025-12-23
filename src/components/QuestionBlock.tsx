// React-хуки: состояние, эффекты, ссылки на DOM, мемоизация списков
import { useState, useEffect, useRef, useMemo } from "react";

// Framer Motion — анимации появления/исчезновения блоков
import { motion, AnimatePresence } from "framer-motion";

// Два набора вопросов: для шейки матки и для молочной железы
import { questions, breastQuestions } from "../data/questions";

// Таблица рекомендаций по пути "questionId:optionId" -> текст рекомендации
import { recommendationsByPath } from "../data/recommendations";

// Типы ответов и вопросов (чтобы TS проверял корректность структуры)
import type { Answer, Question } from "../types/Question";

// Стартовый экран выбора теста
import { StartScreen } from "./StartScreen";

// Какие “экраны” есть в приложении (старт/тест 1/тест 2)
type Screen = "start" | "cervical" | "breast";

const QuestionBlock = () => {
  // Текущий экран: старт или один из тестов
  const [screen, setScreen] = useState<Screen>("start");

  // Массив выбранных ответов (история: какой optionId выбран для какого questionId)
  const [answers, setAnswers] = useState<Answer[]>([]);

  // ID текущего вопроса, который надо показывать пользователю
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1");

  // Финальная рекомендация (когда у выбранного ответа нет nextQuestionId)
  const [finalRecommendation, setFinalRecommendation] = useState<string | null>(
    null
  );

  // ref на контейнер (может пригодиться для скролла/измерений)
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ref на “якорь” внизу, чтобы скроллить к последнему элементу
  const endRef = useRef<HTMLDivElement | null>(null);

  // Выбираем набор вопросов в зависимости от выбранного теста
  // useMemo — чтобы не пересчитывать список на каждый рендер без надобности
  const activeQuestions = useMemo(() => {
    return screen === "breast" ? breastQuestions : questions;
  }, [screen]);

  // Первый вопрос в текущем тесте (если по какой-то причине массив пуст — запасной "q1")
  const firstQuestionId = activeQuestions?.[0]?.id ?? "q1";

  // Когда меняется тест (screen) — сбрасываем прогресс и начинаем с первого вопроса
  useEffect(() => {
    setAnswers([]); // очищаем ответы
    setFinalRecommendation(null); // убираем финальный текст
    setCurrentQuestionId(firstQuestionId); // ставим первый вопрос
  }, [screen, firstQuestionId]);

  // Удобная функция: получить объект вопроса по его id
  const getQuestionById = (id: string): Question | undefined =>
    activeQuestions.find((q) => q.id === id);

  // Обработка выбора ответа:
  // - сохраняем выбор в answers
  // - если есть nextQuestionId — показываем следующий вопрос
  // - если nextQuestionId нет — это финал, берём рекомендацию
  const handleAnswer = (
    questionId: string,
    optionId: string,
    nextId?: string
  ) => {
    // Перезаписываем ответ на этот questionId (если пользователь вернулся и выбрал иначе)
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questionId),
      { questionId, optionId },
    ];
    setAnswers(newAnswers);

    // Если указан следующий вопрос — идём дальше по цепочке
    if (nextId) {
      setCurrentQuestionId(nextId);
    } else {
      // Если следующего вопроса нет — формируем ключ пути для рекомендаций
      const key = `${questionId}:${optionId}`;

      // Берём рекомендацию из словаря или дефолтный текст
      const recommendation =
        recommendationsByPath[key] ||
        "Пожалуйста, проконсультируйтесь с врачом.";

      // Сохраняем финальную рекомендацию (появится блок “Рекомендации:”)
      setFinalRecommendation(recommendation);
    }
  };

  // Кнопка “Назад”:
  // - убираем последний ответ
  // - возвращаемся к вопросу, который был последним отвеченным
  const handleBack = () => {
    const newAnswers = [...answers]; // копия массива ответов
    const last = newAnswers.pop(); // удаляем последний ответ
    setAnswers(newAnswers);

    // Если была финальная рекомендация — убираем, чтобы снова показывать вопросы
    setFinalRecommendation(null);

    // Возвращаемся на вопрос, который только что “откатили”
    // (либо на самый первый, если ответов больше нет)
    setCurrentQuestionId(last?.questionId || firstQuestionId);
  };

  // “Вернуться к выбору теста” — уводим на стартовый экран
  const handleRestart = () => {
    setScreen("start");
  };

  // “Начать заново” — сбрасываем прохождение текущего теста, но остаёмся в нём
  const handleResetCurrentTest = () => {
    setAnswers([]);
    setFinalRecommendation(null);
    setCurrentQuestionId(firstQuestionId);
  };

  // Превращаем ответы в список “уже отвеченных вопросов”
  // (чтобы их отрисовать сверху как историю)
  const answeredQuestions = answers
    .map((a) => getQuestionById(a.questionId))
    .filter(Boolean) as Question[];

  // Текущий вопрос (который нужно спросить сейчас)
  const currentQuestion = getQuestionById(currentQuestionId);

  // Показываем текущий вопрос, только если на него ещё не отвечали
  const showCurrentQuestion =
    currentQuestion &&
    !answers.some((a) => a.questionId === currentQuestion.id);

  // Итоговый список вопросов для рендера:
  // - сначала все отвеченные
  // - затем текущий (если надо показывать)
  const questionsToRender = [...answeredQuestions];
  if (showCurrentQuestion && currentQuestion) {
    questionsToRender.push(currentQuestion);
  }

  // Получить выбранный optionId для вопроса (нужно, чтобы подсветить кнопку)
  const getSelectedOption = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.optionId;

  // Автоскролл вниз при добавлении нового вопроса или финальной рекомендации
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [questionsToRender.length, finalRecommendation]);

  return (
    // Основной контейнер компонента
    <div ref={containerRef} className="w-full flex justify-center px-4">
      {/* Карточка с контентом */}
      <div className="w-full max-w-4xl rounded-3xl bg-white p-4 md:p-8 shadow-sm border border-blue-100">
        {/* Заголовок — зависит от выбранного экрана */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          {screen === "cervical" && "Скрининг на рак шейки матки"}
          {screen === "breast" && "Скрининг на рак молочной железы"}
          {screen === "start" && "OncoScreen"}
        </h1>

        <div className="pb-8">
          {/* Переключаем экраны с анимацией */}
          <AnimatePresence mode="wait">
            {screen === "start" ? (
              // Стартовый экран выбора теста
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* При выборе — переключаем screen на "cervical" или "breast" */}
                <StartScreen onSelect={(next) => setScreen(next)} />
              </motion.div>
            ) : (
              // Экран теста (вопросы/ответы/рекомендации)
              <motion.div
                key="test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence mode="wait">
                  {/* Центрируем контент и ограничиваем ширину */}
                  <motion.div layout className="space-y-4 max-w-4xl mx-auto">
                    {questionsToRender.map((q) => {
                      // Для каждого вопроса смотрим, выбран ли уже ответ
                      const selectedOptionId = getSelectedOption(q.id);

                      return (
                        <motion.div
                          key={q.id}
                          className="rounded-2xl bg-white p-4 md:p-6"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.4 }}
                          layout
                        >
                          {/* Текст вопроса */}
                          <p className="font-semibold text-base md:text-lg mb-4 text-black text-center">
                            {q.text}
                          </p>

                          {/* Сетка ответов: 1 колонка на мобиле, 2 на sm+ */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, index) => {
                              // Подсветка выбранного ответа
                              const isSelected = selectedOptionId === opt.id;

                              // Если уже ответили на вопрос — блокируем остальные варианты
                              const isDisabled = !!selectedOptionId;

                              // Если вариантов нечётное число, последний в десктопе
                              // растягиваем на 2 колонки и центрируем (чтобы не “висел слева”)
                              const isLastOdd =
                                q.options.length % 2 === 1 &&
                                index === q.options.length - 1;

                              return (
                                <button
                                  key={opt.id}
                                  disabled={isDisabled}
                                  onClick={() =>
                                    handleAnswer(
                                      q.id,
                                      opt.id,
                                      opt.nextQuestionId
                                    )
                                  }
                                  className={`
                                    px-4 py-3 rounded-2xl border transition-all text-base md:text-lg
                                    break-words text-center whitespace-normal
                                    ${
                                      isLastOdd
                                        ? "sm:col-span-2 sm:justify-self-center sm:w-1/2"
                                        : ""
                                    }
                                    ${
                                      isSelected
                                        ? "bg-blue-200 border-blue-300 text-blue-950"
                                        : "bg-[#f3f6f8] border-transparent text-black"
                                    }
                                    ${
                                      isDisabled
                                        ? "opacity-70 cursor-not-allowed"
                                        : "hover:border-blue-400 hover:shadow-md"
                                    }
                                  `}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Финальный блок рекомендаций (появляется в конце) */}
                    {finalRecommendation && (
                      <motion.div
                        key="recommendation"
                        className="rounded-2xl bg-white p-4 md:p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        layout
                      >
                        <p className="text-base md:text-lg font-semibold text-black">
                          Рекомендации:
                        </p>
                        <p className="text-gray-800 mt-2">
                          {finalRecommendation}
                        </p>
                      </motion.div>
                    )}

                    {/* Якорь для автоскролла вниз */}
                    <div ref={endRef} />
                  </motion.div>
                </AnimatePresence>

                {/* Нижние кнопки управления */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                  {/* Левая кнопка: вернуться на старт */}
                  <button
                    onClick={handleRestart}
                    className="rounded-2xl bg-gray-200 text-blue-950 font-medium py-3 px-6 hover:bg-gray-300 order-3 sm:order-1"
                  >
                    ← Вернуться к выбору теста
                  </button>

                  {/* Правые кнопки: назад и сброс теста */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-end order-1 sm:order-2">
                    <button
                      onClick={handleBack}
                      disabled={answers.length === 0}
                      className="rounded-2xl bg-gray-200 text-blue-950 font-medium py-3 px-6 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Назад
                    </button>

                    <button
                      onClick={handleResetCurrentTest}
                      className="rounded-2xl bg-blue-200 text-blue-950 font-medium py-3 px-6 hover:bg-blue-300"
                    >
                      Начать заново
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Экспорт по умолчанию — чтобы импортировать компонент как `import QuestionBlock from ...`
export default QuestionBlock;
