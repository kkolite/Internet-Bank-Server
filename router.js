const Router = require('express');
const router = new Router();
const Controller = require('./controller');

router.post('/registration', Controller.newUser);
router.post('/login', Controller.login);
router.get('/', Controller.getInfo);
router.put('/', /* func */);
router.delete('/', Controller.deleteUser);

module.exports = router;