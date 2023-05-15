import { Router } from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  confirmEmail,
  updatePassword,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/confirmEmail', confirmEmail);
router.put('/updateDetails/', protect, updateDetails);
router.put('/updatePassword/', protect, updatePassword);
router.post('/forgetPassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export { router as authRoute };
