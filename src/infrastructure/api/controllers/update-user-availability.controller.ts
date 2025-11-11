import { Request, Response } from 'express';
import { UpdateUserAvailabilityUseCase } from '../../../application/use-cases/update-user-availability.use-case';

export class UpdateUserAvailabilityController {
  constructor(private readonly updateUserAvailabilityUseCase: UpdateUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { dayOfWeek } = req.params;
      const { startTime, endTime } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await this.updateUserAvailabilityUseCase.execute({
        userId,
        dayOfWeek: dayOfWeek as any,
        startTime,
        endTime
      });

      res.status(200).json({
        success: true,
        message: 'Availability updated successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating availability'
      });
    }
  };
}
