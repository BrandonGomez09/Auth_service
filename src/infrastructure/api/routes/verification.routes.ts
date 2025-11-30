import { Router } from 'express';
import {
  verifyEmailController,
  resendEmailVerificationController,
  verifyPhoneController,
  resendPhoneVerificationController
} from '../dependencies/dependencies';

import { AuthMiddleware } from '../../../middleware/auth.middleware';
const authMiddleware = new AuthMiddleware();

const router = Router();

router.get('/email/:token',
  verifyEmailController.handle.bind(verifyEmailController)
);

router.post('/email/resend',
  authMiddleware.authenticate,
  resendEmailVerificationController.handle.bind(resendEmailVerificationController)
);

router.post('/phone',
  authMiddleware.authenticate,  
  verifyPhoneController.handle.bind(verifyPhoneController)
);

router.post('/phone/resend',
  authMiddleware.authenticate,  
  resendPhoneVerificationController.handle.bind(resendPhoneVerificationController)
);

export default router;
