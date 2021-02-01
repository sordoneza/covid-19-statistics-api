import { Router } from 'express';
import { STATISTICS_ENDPOINT } from '../constants/endpoint';
import {
  statistics_get,
  statistics_by_country_get,
  statistics_put,
} from '../controllers/statisticController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get(STATISTICS_ENDPOINT, requireAuth, statistics_get);
router.get(`${STATISTICS_ENDPOINT}/:countryId`, requireAuth, statistics_by_country_get);
router.put(`${STATISTICS_ENDPOINT}`, requireAuth, statistics_put);

export default router;
