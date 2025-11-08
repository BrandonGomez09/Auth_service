import { Request, Response } from 'express';
import { RegisterKitchenAdminUseCase } from '../../../application/use-cases/register-kitchen-admin.use-case';
import { RegisterKitchenAdminDto } from '../../../application/dtos/register-kitchen-admin.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class RegisterKitchenAdminController {
  constructor(
    private readonly registerKitchenAdminUseCase: RegisterKitchenAdminUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToInstance(RegisterKitchenAdminDto, req.body);

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const result = await this.registerKitchenAdminUseCase.execute(dto);

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error in RegisterKitchenAdminController:', error);

      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}