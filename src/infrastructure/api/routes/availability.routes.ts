import { Router } from 'express';
import {
  setUserAvailabilityController,
  getUserAvailabilityController,
  checkUserAvailabilityController,
  updateUserAvailabilityController,
  deleteUserAvailabilityController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const router = Router();
const authMiddleware = new AuthMiddleware();

router.get('/:userId', getUserAvailabilityController.handle.bind(getUserAvailabilityController));

router.get('/me', authMiddleware.authenticate, getUserAvailabilityController.handle.bind(getUserAvailabilityController));

router.post('/me', authMiddleware.authenticate, setUserAvailabilityController.handle.bind(setUserAvailabilityController));

router.put('/me/:dayOfWeek', authMiddleware.authenticate, updateUserAvailabilityController.handle.bind(updateUserAvailabilityController));

router.delete('/me/:dayOfWeek', authMiddleware.authenticate, deleteUserAvailabilityController.handle.bind(deleteUserAvailabilityController));

router.post('/:userId/check', checkUserAvailabilityController.handle.bind(checkUserAvailabilityController));

export default router;
