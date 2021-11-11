import { Router } from 'express';

import PostsController from './controllers/PostsController.js';

const router = Router();

router.post('/articles', PostsController.store);
router.get('/articles', PostsController.index);
router.get('/articles/:id', PostsController.show);

export default router;
