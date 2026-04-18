import { Router } from 'express';
import { getStudents, getCompanies, approveCompany, rejectCompany, suspendUser, deleteUser } from '../controllers/adminController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.patch('/companies/:id/approve', approveCompany);
router.patch('/companies/:id/reject', rejectCompany);
router.patch('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

export default router;
