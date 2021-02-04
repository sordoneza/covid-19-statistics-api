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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       in: header,
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *     errorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message.
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message.
 *         accessToken:
 *           type: string
 *           description: AccessToken.
 *         refreshToken:
 *           type: string
 *           description: RefreshToken.
 *         userInfo:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               descrition: User ID.
 *             email:
 *               type: string
 *               description: User email
 *         expiresAt:
 *           type: integer
 *           description: Access token expires at
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/AuthResponse'
 *       403:
 *        description: User already exist
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/errorResponse'
 *
 */
router.post(`${AUTH_ENDPOINT}/signup`, signup_post);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login request for an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Log in success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/AuthResponse'
 *       403:
 *        description: User not found
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/errorResponse'
 *
 */

router.post(`${AUTH_ENDPOINT}/login`, login_post);

router.post(`${AUTH_ENDPOINT}/logout`, requireAuth, logout_post);

router.post(`${AUTH_ENDPOINT}/refreshToken`, refreshToken_post);

export default router;
