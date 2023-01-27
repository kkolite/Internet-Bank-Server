const Router = require('express');
const router = new Router();
const moneyController = require('./moneyContoller');

router.post('/', moneyController.change);
router.post('/transfer', moneyController.transfer);

module.exports = router;