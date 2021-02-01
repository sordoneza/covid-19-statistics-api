import { Router } from 'express';
import { SYNC_ENDPOINT } from '../constants/endpoint';
import { sync_get } from '../controllers/statisticController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get(SYNC_ENDPOINT, requireAuth, sync_get);

export default router;
