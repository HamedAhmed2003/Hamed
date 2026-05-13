import { Router } from 'express';
import { protect } from '../middlewares/auth';
import {
  saveBasicInfo,
  saveSoftSkills,
  savePersonality,
  completeOnboarding,
  getOnboardingStatus,
  toggleSavedOpportunity,
  getSavedOpportunities,
} from '../controllers/onboardingController';

const router = Router();

router.use(protect);

router.get('/status', getOnboardingStatus);
router.post('/basic-info', saveBasicInfo);
router.post('/soft-skills', saveSoftSkills);
router.post('/personality', savePersonality);
router.post('/complete', completeOnboarding);
router.post('/save/:opportunityId', toggleSavedOpportunity);
router.get('/saved', getSavedOpportunities);

export default router;
