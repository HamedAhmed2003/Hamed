import { Router } from 'express';
import { submitSupportMessage } from '../controllers/supportController';

const router = Router();

// POST /api/support — submit a contact support message
router.post('/', submitSupportMessage);

export default router;
