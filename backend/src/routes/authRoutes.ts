import { Router } from 'express';
import { signup, verifyEmail, resendOtp, login, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', signup);
router.post('/resend-otp', resendOtp);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
