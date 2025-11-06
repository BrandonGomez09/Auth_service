import { validate, ValidationError } from 'class-validator';

export class PasswordStrengthValidator {
  constructor(private password: string) {}

  async validate(): Promise<void> {
    const errors: string[] = [];

    if (this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(this.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(this.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(this.password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
      errors.push('Password must contain at least one special character');
    }

    if (errors.length > 0) {
      throw {
        http_status: 422,
        message: 'Password validation failed',
        validations: [{
          property: 'password',
          errorMessages: errors
        }]
      };
    }
  }
}