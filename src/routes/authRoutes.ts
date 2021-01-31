import { Router } from 'express';
import { AUTH_ENDPOINT } from '../constants/endpoint';
import { signup_post, login_post, logout_get } from '../controllers/authController';

const router = Router();

router.post(`${AUTH_ENDPOINT}/signup`, signup_post);
router.post(`${AUTH_ENDPOINT}/login`, login_post);
router.get(`${AUTH_ENDPOINT}/logout`, logout_get);

export default router;
