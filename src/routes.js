import { Router } from 'express';

import PostsController from './controllers/PostsController.js';

const router = Router();

router.post('/posts', PostsController.store);
router.get('/posts', PostsController.index);
router.get('/posts/:id', PostsController.show);

export default router;
