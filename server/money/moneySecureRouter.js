import Router from 'express';
const moneySecureRouter = new Router();
import moneyController from './moneyContoller.js';

moneySecureRouter.post('/', moneyController.change);
moneySecureRouter.post('/transfer', moneyController.transfer);
moneySecureRouter.post('/account', moneyController.newCurrencyAccount);
moneySecureRouter.put('/account', moneyController.changeAccountMoney);
moneySecureRouter.delete('/account', moneyController.deleteCurrencyAccount);

export default moneySecureRouter;