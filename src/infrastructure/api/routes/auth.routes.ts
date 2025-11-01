import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  validateTokenController,
  refreshTokenController
} from '../dependencies/dependencies';

const router = Router();

router.post('/register', registerUserController.handle.bind(registerUserController));

router.post('/login', loginUserController.handle.bind(loginUserController));

router.post('/validate-token', validateTokenController.handle.bind(validateTokenController));

router.post('/refresh-token', refreshTokenController.handle.bind(refreshTokenController));

export default router;