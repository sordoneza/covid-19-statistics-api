import { Router } from 'express';
import { AUTH_ENDPOINT } from '../constants/endpoint';
import {
  signup_post,
  login_post,
  logout_post,
  refreshToken_post,
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post(`${AUTH_ENDPOINT}/signup`, signup_post);
router.post(`${AUTH_ENDPOINT}/login`, login_post);
router.post(`${AUTH_ENDPOINT}/logout`, requireAuth, logout_post);
router.post(`${AUTH_ENDPOINT}/refreshToken`, refreshToken_post);

export default router;
