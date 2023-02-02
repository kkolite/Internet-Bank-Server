import Router from 'express';
import quizController from './quizController.js';
const quizRouter = new Router();

quizRouter.get('/', quizController.getQustions);
quizRouter.post('/', quizController.check);

export default quizRouter;
