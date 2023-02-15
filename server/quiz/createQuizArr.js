import quiz from "../data/quiz.js";

export function createQuizArr(arr) {
  const length = quiz.length;
  const key = Math.ceil(Math.random() * 10);
  const question = quiz.find((el) => el.id == key);
  if (!arr.find((el) => el.id === question.id)) {
    arr.push({
      id: question.id,
      question: question.question,
      answers: question.answers,
      desc: question.desc,
    });
  }

  if (arr.length === 5) return arr;
  return createQuizArr(arr);
}