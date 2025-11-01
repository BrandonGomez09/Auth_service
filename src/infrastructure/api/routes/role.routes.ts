import { Router } from 'express';
import {
  assignRoleController,
  removeRoleController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware';

const router = Router();
const authMiddleware = new AuthMiddleware();

router.post('/assign',authMiddleware.authenticate, authMiddleware.authorize('admin', 'superadmin'), assignRoleController.handle.bind(assignRoleController)
);

router.post('/remove', authMiddleware.authenticate, authMiddleware.authorize('admin', 'superadmin'), removeRoleController.handle.bind(removeRoleController)
);

export default router;
