const Router = require('express');
const router = new Router();
const controller = require('./adminController');

router.get('/', controller.check);
router.get('/bank', controller.getBank);
router.get('/database', controller.getDatabase);
router.get('/user', controller.getUser);

module.exports = router;