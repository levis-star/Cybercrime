import { Router } from 'express';
import { listAwareness } from '../controllers/awarenessController.js';

const router = Router();

router.get('/content', listAwareness);

export default router;
