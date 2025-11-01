import { Router } from 'express';
import {
  verifyEmailController,
  resendEmailVerificationController,
  verifyPhoneController,
  resendPhoneVerificationController
} from '../dependencies/dependencies';

const router = Router();

router.get('/email/:token', (req, res) => verifyEmailController.handle(req, res));

router.post('/email/resend', (req, res) => resendEmailVerificationController.handle(req, res));

router.post('/phone', (req, res) => verifyPhoneController.handle(req, res));

router.post('/phone/resend', (req, res) => resendPhoneVerificationController.handle(req, res));

export default router;