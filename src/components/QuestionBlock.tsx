import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions, breastQuestions } from "../data/questions";
import { recommendationsByPath } from "../data/recommendations";
import type { Answer, Question } from "../types/Question";
import { StartScreen } from "./StartScreen";

type Screen = "start" | "cervical" | "breast";

const QuestionBlock = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1");
  const [finalRecommendation, setFinalRecommendation] = useState<string | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const activeQuestions = useMemo(() => {
    return screen === "breast" ? breastQuestions : questions;
  }, [screen]);

  const firstQuestionId = activeQuestions?.[0]?.id ?? "q1";

  useEffect(() => {
    setAnswers([]);
    setFinalRecommendation(null);
    setCurrentQuestionId(firstQuestionId);
  }, [screen, firstQuestionId]);

  const getQuestionById = (id: string): Question | undefined =>
    activeQuestions.find((q) => q.id === id);

  const handleAnswer = (
    questionId: string,
    optionId: string,
    nextId?: string
  ) => {
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questionId),
      { questionId, optionId },
    ];
    setAnswers(newAnswers);

    if (nextId) {
      setCurrentQuestionId(nextId);
    } else {
      const key = `${questionId}:${optionId}`;
      const recommendation =
        recommendationsByPath[key] ||
        "Пожалуйста, проконсультируйтесь с врачом.";
      setFinalRecommendation(recommendation);
    }
  };

  const handleBack = () => {
    const newAnswers = [...answers];
    const last = newAnswers.pop();
    setAnswers(newAnswers);
    setFinalRecommendation(null);
    setCurrentQuestionId(last?.questionId || firstQuestionId);
  };

  const handleRestart = () => {
    setScreen("start");
  };

  const handleResetCurrentTest = () => {
    setAnswers([]);
    setFinalRecommendation(null);
    setCurrentQuestionId(firstQuestionId);
  };


  const answeredQuestions = answers
    .map((a) => getQuestionById(a.questionId))
    .filter(Boolean) as Question[];

  const currentQuestion = getQuestionById(currentQuestionId);
  const showCurrentQuestion =
    currentQuestion &&
    !answers.some((a) => a.questionId === currentQuestion.id);

  const questionsToRender = [...answeredQuestions];
  if (showCurrentQuestion && currentQuestion) {
    questionsToRender.push(currentQuestion);
  }

  const getSelectedOption = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.optionId;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [questionsToRender.length, finalRecommendation]);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="w-full rounded-3xl bg-white p-4 md:p-8 shadow-sm border border-blue-100">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          {screen === "cervical" && "Скрининг на рак шейки матки"}
          {screen === "breast" && "Скрининг на рак молочной железы"}
          {screen === "start" && "OncoScreen"}
        </h1>

        <div className="pb-8">
          <AnimatePresence mode="wait">
            {screen === "start" ? (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StartScreen onSelect={(next) => setScreen(next)} />
              </motion.div>
            ) : (
              <motion.div
                key="test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div layout className="space-y-4 max-w-4xl mx-auto">
                    {questionsToRender.map((q) => {
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
                          <p className="font-semibold text-base md:text-lg mb-4 text-black text-center">
                            {q.text}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, index) => {
                              const isSelected = selectedOptionId === opt.id;
                              const isDisabled = !!selectedOptionId;

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
                                    ${isLastOdd ? "sm:col-span-2 sm:justify-self-center sm:w-1/2" : ""}
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

                    <div ref={endRef} />
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                  {/* Левая кнопка */}
                  <button
                    onClick={handleRestart}
                    className="rounded-2xl bg-gray-200 text-blue-950 font-medium py-3 px-6 hover:bg-gray-300 order-3 sm:order-1"
                  >
                    ← Вернуться к выбору теста
                  </button>

                  {/* Правые кнопки */}
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

export default QuestionBlock;
