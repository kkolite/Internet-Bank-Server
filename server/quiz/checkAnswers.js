import quiz from "../data/quiz";

export function checkAnswers(answers) {
  let correct = 0;
  answers.forEach((el) => {
    const question = quiz.find((q) => q.id == el.id);
    if (el.answer == question.enCorrect || el.answer == question.ruCorrect) {
      correct++;
    }
  })
  return correct;
}