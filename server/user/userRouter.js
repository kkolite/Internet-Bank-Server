const Router = require('express');
const router = new Router();
const userController = require('./userController');

router.post('/registration', userController.newUser);
router.post('/login', userController.login);
router.post('/verify', userController.verify);
router.get('/check', userController.isUser);
router.get('/', userController.getInfo);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

module.exports = router;