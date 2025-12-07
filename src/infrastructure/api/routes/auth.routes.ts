import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  validateTokenController,
  refreshTokenController,
  registerKitchenAdminController,
  googleLoginController
} from '../dependencies/dependencies';

const router = Router();

router.post('/register', registerUserController.handle.bind(registerUserController));

router.post('/register-kitchen-admin', registerKitchenAdminController.handle.bind(registerKitchenAdminController));

router.post('/login', loginUserController.handle.bind(loginUserController));

router.post('/google', googleLoginController.handle.bind(googleLoginController));

router.post('/validate-token', validateTokenController.handle.bind(validateTokenController));

router.post('/refresh-token', refreshTokenController.handle.bind(refreshTokenController));

export default router;
