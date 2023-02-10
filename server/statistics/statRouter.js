import Router from 'express';
const statRouter = new Router();
import controller from './statController.js';

statRouter.get('/', controller.getStatistics);

export default statRouter;
