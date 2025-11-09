import { Router } from 'express';
import {
  setUserAvailabilityController,
  getUserAvailabilityController,
  checkUserAvailabilityController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const authMiddleware = new AuthMiddleware(); 
const router = Router();

router.get('/:userId', getUserAvailabilityController.handle.bind(getUserAvailabilityController));

router.post('/me', authMiddleware.authenticate, setUserAvailabilityController.handle.bind(setUserAvailabilityController));

router.post('/:userId/check', checkUserAvailabilityController.handle.bind(checkUserAvailabilityController));

export default router;