import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { BaseValidator } from './validator';

export class PasswordResetTokenValidator extends BaseValidator<PasswordResetToken> {
  constructor(token: PasswordResetToken) {
    super(token);
  }

  public async validateWithCustomRules(): Promise<void> {
    await this.validate();

    if (this.isExpired()) {
      this.listErrors.push({
        property: 'expiresAt',
        constraints: {
          isExpired: 'Password reset token has expired'
        },
        children: [],
        target: this.entity,
        value: this.entity.expiresAt
      });
    }

    if (this.entity.isUsed) {
      this.listErrors.push({
        property: 'isUsed',
        constraints: {
          alreadyUsed: 'Password reset token has already been used'
        },
        children: [],
        target: this.entity,
        value: this.entity.isUsed
      });
    }

    if (this.hasErrors()) {
      throw {
        http_status: 422,
        validations: this.getFormattedErrors()
      };
    }
  }

  public isExpired(): boolean {
    return new Date() > this.entity.expiresAt;
  }


  public isValidToken(): boolean {
    return !this.entity.isUsed && !this.isExpired();
  }


  public getMinutesRemaining(): number {
    const now = new Date();
    const diff = this.entity.expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60)));
  }
}