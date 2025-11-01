import { PhoneVerification } from '../entities/phone-verification.entity';
import { BaseValidator } from './validator';

export class PhoneVerificationValidator extends BaseValidator<PhoneVerification> {
  private readonly MAX_ATTEMPTS = 3;

  constructor(phoneVerification: PhoneVerification) {
    super(phoneVerification);
  }

  public async validateWithCustomRules(): Promise<void> {
    await this.validate();

    if (this.isExpired()) {
      this.listErrors.push({
        property: 'expiresAt',
        constraints: {
          isExpired: 'Verification code has expired'
        },
        children: [],
        target: this.entity,
        value: this.entity.expiresAt
      });
    }

    if (this.hasExceededMaxAttempts()) {
      this.listErrors.push({
        property: 'attempts',
        constraints: {
          maxAttemptsExceeded: `Maximum attempts (${this.MAX_ATTEMPTS}) exceeded`
        },
        children: [],
        target: this.entity,
        value: this.entity.attempts
      });
    }

    if (this.entity.isUsed) {
      this.listErrors.push({
        property: 'isUsed',
        constraints: {
          alreadyUsed: 'Verification code has already been used'
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


  public hasExceededMaxAttempts(): boolean {
    return this.entity.attempts >= this.MAX_ATTEMPTS;
  }


  public isValidCode(): boolean {
    return !this.entity.isUsed && !this.isExpired() && !this.hasExceededMaxAttempts();
  }


  public getRemainingAttempts(): number {
    return Math.max(0, this.MAX_ATTEMPTS - this.entity.attempts);
  }
}