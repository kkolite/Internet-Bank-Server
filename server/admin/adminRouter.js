import Router from 'express';
const router = new Router();
import controller from './adminController.js';

router.get('/', controller.check);
router.get('/bank', controller.getBank);
router.get('/database', controller.getDatabase);
router.get('/user', controller.getUser);
router.post('/user', controller.createUser);
router.put('/user', controller.blockUser);
router.delete('/user', controller.deleteUser);

export default router;
