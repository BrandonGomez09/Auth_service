import { Router } from 'express';
import {
  getUserPermissionsController,
  checkUserPermissionController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware';

const router = Router();
const authMiddleware = new AuthMiddleware();

router.get('/user/:userId', authMiddleware.authenticate, getUserPermissionsController.handle.bind(getUserPermissionsController));

router.post('/check', authMiddleware.authenticate, checkUserPermissionController.handle.bind(checkUserPermissionController)
);

export default router;
