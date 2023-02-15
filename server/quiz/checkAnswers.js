import quiz from "../data/quiz.js";

export function checkAnswers(answers) {
  let correct = 0;
  answers.forEach((el) => {
    const question = quiz.find((q) => q.id == el.id);
    if (el.answer === question.correct.en || el.answer === question.correct.ru) {
      correct++;
    }
  })
  return correct;
}