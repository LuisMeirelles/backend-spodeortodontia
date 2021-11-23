import { Router } from 'express';

import PostsController from './controllers/PostsController.js';
import UsersController from './controllers/UsersController.js';

import AuthMiddleware from './middlewares/AuthMiddleware.js';

const router = Router();

router.get('/posts', PostsController.index);
router.get('/posts/:id', PostsController.show);

router.post('/users', UsersController.store);
router.get('/users', UsersController.index);
router.get('/users/:id', UsersController.show);

router.use(AuthMiddleware.auth);

router.post('/posts', PostsController.store);

export default router;
