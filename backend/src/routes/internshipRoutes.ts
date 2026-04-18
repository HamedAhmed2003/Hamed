import { Router } from 'express';
import { getInternships, getInternshipById, createInternship, updateInternship, deleteInternship, getExam } from '../controllers/internshipController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getInternships);
router.get('/:id', getInternshipById);
router.post('/', protect, authorize('company'), createInternship);
router.put('/:id', protect, authorize('company'), updateInternship);
router.delete('/:id', protect, authorize('company', 'admin'), deleteInternship);

import { submitExamAndApply, applyWithoutExam } from '../controllers/applicationController';

router.get('/:id/exam', protect, authorize('student'), getExam);
router.post('/:id/apply', protect, authorize('student'), applyWithoutExam);
router.post('/:id/exam/submit', protect, authorize('student'), submitExamAndApply);

export default router;
