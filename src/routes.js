import { Router } from 'express';

const router = Router();

router.get('/posts', (req, res) => res.json({ message: 'success' }));

export default router;
