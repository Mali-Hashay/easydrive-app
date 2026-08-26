import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/forgot-password', AuthController.forgotPassword);
AuthRouter.post('/reset-password/:id/:token', AuthController.resetPassword);
AuthRouter.get('/me',verifyToken, AuthController.getCurrentUser);
AuthRouter.patch('/me', verifyToken, AuthController.updateProfile);
AuthRouter.patch('/change-password', verifyToken, AuthController.changePassword);

export default AuthRouter;

