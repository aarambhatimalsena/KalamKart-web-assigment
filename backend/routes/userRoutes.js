import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  googleAuthController,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';

import {
  validateRegister,
  validateLogin,
} from '../middleware/validators/userValidator.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//  Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/google-auth', googleAuthController);

//  Forgot + Reset Password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//  Protected routes (only logged-in users)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
