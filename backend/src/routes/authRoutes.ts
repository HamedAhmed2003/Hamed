import { Router } from 'express';
import { signup, verifyEmail, resendOtp, login, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import multer from 'multer';

import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.post('/signup', signup);
router.post('/resend-otp', resendOtp);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
