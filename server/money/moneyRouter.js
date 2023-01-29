const Router = require('express');
const router = new Router();
const moneyController = require('./moneyContoller');

router.post('/', moneyController.change);
router.post('/transfer', moneyController.transfer);
router.post('/commission', moneyController.commissionToBank);
router.post('/exchange', moneyController.currencyExchange);
router.post('/account', moneyController.newCurrencyAccount);
router.delete('/account', moneyController.deleteCurrencyAccount);

module.exports = router;