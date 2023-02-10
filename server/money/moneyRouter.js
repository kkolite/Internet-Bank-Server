import Router from 'express';
const router = new Router();
import moneyController from './moneyContoller.js';


router.post('/commission', moneyController.commissionToBank);
router.post('/exchange', moneyController.currencyExchange);
router.post('/card', moneyController.card);
router.post('/check', moneyController.check);

export default router;
