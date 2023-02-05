import Router from 'express';
const router = new Router();
import userController from './userController.js';

router.get('/', userController.getInfo);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);
router.post('/card', userController.saveCard)

export default router;
