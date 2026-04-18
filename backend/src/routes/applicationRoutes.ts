import { Router } from 'express';
import { getMyApplications, updateApplicationStatus, getInternshipApplications, submitExamAndApply, applyWithoutExam, getCompanyApplications } from '../controllers/applicationController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

// Used when student navigates to /applications
router.get('/me', protect, authorize('student'), getMyApplications);

// For Company accessing applications from internship
router.get('/internship/:internshipId', protect, authorize('company'), getInternshipApplications);

// For Company accessing all applications across all their internships
router.get('/company', protect, authorize('company'), getCompanyApplications);

// Status update
router.patch('/:id/status', protect, authorize('company'), updateApplicationStatus);

// Notice these routes fall under '/api/internships' in the frontend api.ts:
// applicationService.apply: api.post(`/internships/${internshipId}/apply`, data) -> mapped in internship routes/index
// examService.submitExam: api.post(`/internships/${internshipId}/exam/submit`, { answers })

export default router;
