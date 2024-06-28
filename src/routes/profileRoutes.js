// routes/profileRoutes.js
import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../controllers/userController.js';

const router = Router();

router.get('/profile', protect, getUserProfile);
router.post('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

export default router;
