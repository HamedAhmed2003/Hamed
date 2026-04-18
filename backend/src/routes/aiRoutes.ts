import { Router } from 'express';
import { extractSkills } from '../controllers/aiController';
import { protect, authorize } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/extract-skills', protect, authorize('student'), upload.single('cv'), extractSkills);

export default router;
