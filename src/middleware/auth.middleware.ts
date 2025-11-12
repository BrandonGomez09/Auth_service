import { Request, Response, NextFunction } from 'express';
import { JwtTokenGeneratorService } from '../services/jwt-token-generator.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        roles?: string[];
      };
    }
  }
}

export class AuthMiddleware {
  private tokenGenerator: JwtTokenGeneratorService;

  constructor() {
    this.tokenGenerator = new JwtTokenGeneratorService();
  }

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o no proporcionado'
        });
        return;
      }

      const token = authHeader.substring(7); 
      
      if (!token || token.trim() === '') {
        res.status(401).json({
          success: false,
          message: 'Token inválido o no proporcionado'
        });
        return;
      }

      const payload = this.tokenGenerator.verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
        roles: payload.roles
      };

      next();
    } catch (error: any) {
      console.error('Error en autenticación:', error.message);
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  };

  authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Autenticación requerida'
        });
        return;
      }

      const userRoles = req.user.roles || [];
      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        res.status(403).json({
          success: false,
          message: 'Permisos insuficientes',
          requiredRoles: allowedRoles,
          userRoles: userRoles
        });
        return;
      }

      next();
    };
  };
}