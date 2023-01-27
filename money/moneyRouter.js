const Router = require('express');
const router = new Router();
const moneyController = require('./moneyContoller');

router.post('/', moneyController.change);

module.exports = router;