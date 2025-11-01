import { PasswordResetToken } from '../entities/password-reset-token.entity';

export interface IPasswordResetTokenRepository {
  save(token: PasswordResetToken): Promise<PasswordResetToken>;
  findById(id: number): Promise<PasswordResetToken | null>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  findByUserId(userId: number): Promise<PasswordResetToken[]>;
  findLatestByUserId(userId: number): Promise<PasswordResetToken | null>;
  update(id: number, token: Partial<PasswordResetToken>): Promise<PasswordResetToken>;
  delete(id: number): Promise<void>;
  deleteExpired(): Promise<void>;
  invalidateAllByUserId(userId: number): Promise<void>;
}