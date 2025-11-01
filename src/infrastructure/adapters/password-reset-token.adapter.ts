import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { PasswordResetTokenSchema } from '../../database/schemas/password-reset-token.schema';
import { IPasswordResetTokenRepository } from '../../domain/interfaces/password-reset-token.repository.interface';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';

export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private repository: Repository<PasswordResetTokenSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(PasswordResetTokenSchema);
  }

  async save(token: PasswordResetToken): Promise<PasswordResetToken> {
    const schema = this.repository.create({
      userId: token.userId,
      token: token.token,
      expiresAt: token.expiresAt,
      isUsed: token.isUsed,
      usedAt: token.usedAt
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<PasswordResetToken | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const schema = await this.repository.findOne({ where: { token } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: number): Promise<PasswordResetToken[]> {
    const schemas = await this.repository.find({ where: { userId } });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findLatestByUserId(userId: number): Promise<PasswordResetToken | null> {
    const schema = await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return schema ? this.toDomain(schema) : null;
  }

  async update(id: number, token: Partial<PasswordResetToken>): Promise<PasswordResetToken> {
    await this.repository.update(id, {
      ...(token.isUsed !== undefined && { isUsed: token.isUsed }),
      ...(token.usedAt !== undefined && { usedAt: token.usedAt })
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Password reset token not found after update');
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

  async invalidateAllByUserId(userId: number): Promise<void> {
    await this.repository.update(
      { userId, isUsed: false },
      { isUsed: true, usedAt: new Date() }
    );
  }

  private toDomain(schema: PasswordResetTokenSchema): PasswordResetToken {
    return new PasswordResetToken(
      schema.id,
      schema.userId,
      schema.token,
      schema.expiresAt,
      schema.isUsed,
      schema.createdAt,
      schema.usedAt
    );
  }
}