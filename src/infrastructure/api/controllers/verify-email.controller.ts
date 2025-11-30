import { Request, Response } from 'express';
import path from 'path';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';

export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const token = req.params.token;

    const viewsPath = path.join(__dirname, '../../../views');

    try {
      if (!token) {
        return res.sendFile(path.join(viewsPath, 'invalid-token.html'));
      }

      await this.verifyEmailUseCase.execute({ token });

      return res.sendFile(path.join(viewsPath, 'email-verified.html'));
      
    } catch (error) {
      return res.sendFile(path.join(viewsPath, 'invalid-token.html'));
    }
  }
}