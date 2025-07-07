import express from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateSignup, validateLogin, handleValidationErrors } from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router; 