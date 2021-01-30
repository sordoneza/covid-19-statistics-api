import { Router } from 'express';
import { signup_post, login_post, logout_get } from '../controllers/authController';

const router = Router();

router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/logout', logout_get);

export default router;
