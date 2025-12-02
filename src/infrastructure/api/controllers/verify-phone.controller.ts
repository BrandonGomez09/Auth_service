import { Request, Response } from 'express';
import { VerifyPhoneUseCase } from '../../../application/use-cases/verify-phone.use-case';

export class VerifyPhoneController {
  constructor(private readonly verifyPhoneUseCase: VerifyPhoneUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const code = req.body.code;

      if (!userId || !code) {
        res.status(400).json({
          success: false,
          message: 'Verification code is required'
        });
        return;
      }

      const dto = { userId, code };
      const result = await this.verifyPhoneUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Phone verification failed'
        });
      } else {
        console.error('Verify phone error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}
