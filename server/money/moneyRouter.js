import Router from 'express';
const router = new Router();
import moneyController from './moneyContoller.js';

router.post('/', moneyController.change);
router.post('/transfer', moneyController.transfer);
router.post('/commission', moneyController.commissionToBank);
router.post('/exchange', moneyController.currencyExchange);
router.post('/account', moneyController.newCurrencyAccount);
router.put('/account', moneyController.changeAccountMoney);
router.delete('/account', moneyController.deleteCurrencyAccount);
router.post('/card', moneyController.card);
router.post('/check', moneyController.check);

export default router;
