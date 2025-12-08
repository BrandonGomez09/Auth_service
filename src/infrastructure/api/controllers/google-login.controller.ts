import { Request, Response } from 'express';
import { GoogleLoginUseCase } from '../../../application/use-cases/google-login.use-case';

export class GoogleLoginController {
  constructor(private readonly googleLoginUseCase: GoogleLoginUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body; 

      if (!token) {
        res.status(400).json({ success: false, message: 'Token de Google requerido' });
        return;
      }

      const result = await this.googleLoginUseCase.execute(token);

      if (result.isNewUser) {
        res.status(200).json({
          success: true,
          message: 'Usuario no registrado. Redirigir a completar perfil.',
          data: result
        });
      } else {

        res.status(200).json({
          success: true,
          message: 'Login con Google exitoso',
          data: result
        });
      }

    } catch (error: any) {
      console.error('Google Login Error:', error);
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error interno en login con Google'
      });
    }
  }
}