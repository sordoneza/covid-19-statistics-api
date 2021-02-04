import { Router } from 'express';
import { SYNC_ENDPOINT } from '../constants/endpoint';
import { sync_get } from '../controllers/statisticController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /sync:
 *   get:
 *     summary: Reset statistics data
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Sync data success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sync:
 *                   type: boolean
 *                   descrition: Success
 *       400:
 *        description: Error
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/errorResponse'
 *
 */
router.get(SYNC_ENDPOINT, requireAuth, sync_get);

export default router;
