import { Router } from 'express';
import {
  getStudents, getCompanies, getPendingCompanies,
  approveCompany, rejectCompany,
  suspendUser, deleteUser,
  getPendingOpportunities, approveOpportunity, rejectOpportunity,
  getAdminStats,
} from '../controllers/adminController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

// Users
router.get('/stats', getAdminStats);
router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.get('/companies/pending', getPendingCompanies);
router.patch('/companies/:id/approve', approveCompany);
router.patch('/companies/:id/reject', rejectCompany);
router.patch('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

// Opportunities approval
router.get('/opportunities/pending', getPendingOpportunities);
router.patch('/opportunities/:id/approve', approveOpportunity);
router.patch('/opportunities/:id/reject', rejectOpportunity);

export default router;

