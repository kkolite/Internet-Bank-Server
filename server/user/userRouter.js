import Router from 'express';
const router = new Router();
import userController from './userController.js';

router.post('/registration', userController.newUser);
router.post('/login', userController.login);
router.post('/verify', userController.verify);
router.post('/reset', userController.reset);
router.get('/check', userController.isUser);
router.get('/', userController.getInfo);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

export default router;