import Router from 'express';
const actionRouter = new Router();
import userController from './userController.js';

actionRouter.post('/registration', userController.newUser);
actionRouter.post('/login', userController.login);
actionRouter.post('/verify', userController.verify);
actionRouter.post('/reset', userController.reset);
actionRouter.get('/check', userController.isUser);
actionRouter.get('/services', userController.services);

export default actionRouter;