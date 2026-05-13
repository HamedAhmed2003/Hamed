import { Router } from 'express';
import { getLeaderboard, getVolunteerProfile } from '../controllers/volunteerController';

const router = Router();

// Public routes
router.get('/top-rank', getLeaderboard);
router.get('/:id', getVolunteerProfile);

export default router;
