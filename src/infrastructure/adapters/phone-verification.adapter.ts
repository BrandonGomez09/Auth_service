import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { PhoneVerificationSchema } from '../../database/schemas/phone-verification.schema';
import { IPhoneVerificationRepository } from '../../domain/interfaces/phone-verification.repository.interface';
import { PhoneVerification } from '../../domain/entities/phone-verification.entity';

export class PhoneVerificationRepository implements IPhoneVerificationRepository {
  private repository: Repository<PhoneVerificationSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(PhoneVerificationSchema);
  }

  async save(phoneVerification: PhoneVerification): Promise<PhoneVerification> {
    const schema = this.repository.create({
      userId: phoneVerification.userId,
      code: phoneVerification.code,
      expiresAt: phoneVerification.expiresAt,
      isUsed: phoneVerification.isUsed,
      attempts: phoneVerification.attempts,
      usedAt: phoneVerification.usedAt
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<PhoneVerification | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByCode(code: string): Promise<PhoneVerification | null> {
    const schema = await this.repository.findOne({ where: { code } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: number): Promise<PhoneVerification[]> {
    const schemas = await this.repository.find({ where: { userId } });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findLatestByUserId(userId: number): Promise<PhoneVerification | null> {
    const schema = await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return schema ? this.toDomain(schema) : null;
  }

  async update(id: number, phoneVerification: Partial<PhoneVerification>): Promise<PhoneVerification> {
    await this.repository.update(id, {
      ...(phoneVerification.isUsed !== undefined && { isUsed: phoneVerification.isUsed }),
      ...(phoneVerification.attempts !== undefined && { attempts: phoneVerification.attempts }),
      ...(phoneVerification.usedAt !== undefined && { usedAt: phoneVerification.usedAt })
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Phone verification not found after update');
    }
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteExpired(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }

  private toDomain(schema: PhoneVerificationSchema): PhoneVerification {
    return new PhoneVerification(
      schema.id,
      schema.userId,
      schema.code,
      schema.expiresAt,
      schema.isUsed,
      schema.attempts,
      schema.createdAt,
      schema.usedAt
    );
  }
}