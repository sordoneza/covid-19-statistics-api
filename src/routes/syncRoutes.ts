import { Router } from 'express';
import { SYNC_ENDPOINT } from '../constants/endpoint';
import { sync_get } from '../controllers/statisticController';

const router = Router();

router.get(SYNC_ENDPOINT, sync_get);

export default router;
