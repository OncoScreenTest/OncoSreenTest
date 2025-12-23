// тут указаны типы для вопроса (TypeScript типы - как тип данных для переменных)

export type QuestionOption = {
  // определяем тип для одного варианта ответа
  id: string; // уникальный идентификатор варианта
  label: string; // текст варианта ответа
  nextQuestionId?: string; // id следующего вопроса (опционально, может быть пусто)
};

export type Question = {
  // определяем тип для вопроса
  id: string; // уникальный идентификатор вопроса
  text: string; // текст самого вопроса
  options: QuestionOption[]; // массив вариантов ответов
};

export type Answer = {
  // определяем тип для ответа пользователя
  questionId: string; // id вопроса на который ответили
  optionId: string; // id выбранного варианта ответа
};
