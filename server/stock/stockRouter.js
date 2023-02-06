import Router from 'express';
import stockController from './stockController.js';
const stockRouter = new Router();

stockRouter.get('/', stockController.getData);
stockRouter.post('/', stockController.changeStocks);

export default stockRouter;
