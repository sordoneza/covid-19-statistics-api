import { Router } from 'express';
import { STATISTICS_ENDPOINT } from '../constants/endpoint';
import { statistics_get, statistics_by_country_get } from '../controllers/statisticController';

const router = Router();

router.get(STATISTICS_ENDPOINT, statistics_get);
router.get(`${STATISTICS_ENDPOINT}/:countryId`, statistics_by_country_get);

export default router;
