import { Request, Response } from 'express';
import { GetMyProfileUseCase } from '../../../application/use-cases/get-my-profile.use-case';

export class GetMyProfileController {
  constructor(private readonly getMyProfileUseCase: GetMyProfileUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: Authentication token required'
        });
        return;
      }

      const result = await this.getMyProfileUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Error fetching profile'
        });
      } else {
        console.error('Get My Profile error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}