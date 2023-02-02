import Router from 'express';
import quizController from './quizController';
const quizRouter = new Router();

quizRouter.get('/', quizController.getQustions);
quizRouter.post('/', quizController.check);

export default quizRouter;
