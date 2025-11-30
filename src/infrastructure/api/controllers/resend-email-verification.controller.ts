import { Request, Response } from 'express';
import { ResendEmailVerificationUseCase } from '../../../application/use-cases/resend-email-verification.use-case';

export class ResendEmailVerificationController {
  constructor(private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const dto = { userId: req.user.userId };
      const result = await this.resendEmailVerificationUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message
        });
      } else {
        console.error('Resend email verification error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}