import { checkAnswers } from "./checkAnswers";
import { createQuizArr } from "./createQuizArr";

class QuizController {
  getQustions(req, res) {
    try {
      const questions = createQuizArr([]);
      return res
      .status(200)
      .json({
        message: 'Success',
        success: true,
        questions
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Error!',
        success: false,
      });
    }
  }

  check(req, res) {
    try {
      const {answers} = req.body;
      const result = checkAnswers(answers);
      return res
      .status(200)
      .json({
        message: 'Success',
        success: true,
        result
      })
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Error!',
        success: false,
      });
    }
  }
}

export default new QuizController();