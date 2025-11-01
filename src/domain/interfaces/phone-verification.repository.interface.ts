import { PhoneVerification } from '../entities/phone-verification.entity';

export interface IPhoneVerificationRepository {
  save(phoneVerification: PhoneVerification): Promise<PhoneVerification>;
  findById(id: number): Promise<PhoneVerification | null>;
  findByCode(code: string): Promise<PhoneVerification | null>;
  findByUserId(userId: number): Promise<PhoneVerification[]>;
  findLatestByUserId(userId: number): Promise<PhoneVerification | null>;
  update(id: number, phoneVerification: Partial<PhoneVerification>): Promise<PhoneVerification>;
  delete(id: number): Promise<void>;
  deleteExpired(): Promise<void>;
}