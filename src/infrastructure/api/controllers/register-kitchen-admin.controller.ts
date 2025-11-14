import { Request, Response } from 'express';
import { RegisterAdminKitchenUseCase } from '../../../application/use-cases/register-admin-kitchen.use-case';

export class RegisterKitchenAdminController {
  constructor(private readonly useCase: RegisterAdminKitchenUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const result = await this.useCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}
