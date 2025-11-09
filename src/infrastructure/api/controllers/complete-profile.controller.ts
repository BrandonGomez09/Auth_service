import { Request, Response } from 'express';
import { CompleteProfileUseCase } from '../../../application/use-cases/complete-profile.use-case';
import { CompleteProfileDto } from '../../../application/dtos/complete-profile.dto';

export class CompleteProfileController {
  constructor(private readonly completeProfileUseCase: CompleteProfileUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found in token'
        });
        return;
      }
      
      const dto = new CompleteProfileDto(
        userId, // USAMOS EL ID DEL TOKEN
        req.body.skillIds
      );
      
      const result = await this.completeProfileUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error completing profile'
      });
    }
  };
}