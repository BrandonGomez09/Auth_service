export interface PasswordStrength {
  score: number;
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
}

export class PasswordStrengthValidator {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  public validateMinimumRequirements(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.password || this.password.length === 0) {
      errors.push('Password cannot be empty');
      return { isValid: false, errors };
    }

    if (this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(this.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(this.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(this.password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public calculateStrength(): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    if (this.password.length >= 8) score++;
    if (this.password.length >= 12) score++;
    if (this.password.length >= 16) score++;

    if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) {
      score++;
    } else {
      feedback.push('Add both uppercase and lowercase letters');
    }

    if (/[0-9]/.test(this.password)) {
      score++;
    } else {
      feedback.push('Add numbers');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
      score++;
    } else {
      feedback.push('Add special characters');
    }

    if (this.isCommonPassword()) {
      score = Math.max(0, score - 2);
      feedback.push('This is a common password. Choose something more unique');
    }

    const strengthMap: Record<number, PasswordStrength['strength']> = {
      0: 'very-weak',
      1: 'weak',
      2: 'fair',
      3: 'good',
      4: 'strong',
      5: 'very-strong'
    };

    return {
      score: Math.min(score, 5),
      strength: strengthMap[Math.min(score, 5)],
      feedback
    };
  }

  private isCommonPassword(): boolean {
    const commonPasswords = [
      'password', 'Password', 'password123', 'Password123',
      '123456', '12345678', 'qwerty', 'abc123'
    ];

    return commonPasswords.includes(this.password.toLowerCase());
  }


  public static doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}