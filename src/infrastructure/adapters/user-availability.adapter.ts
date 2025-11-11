import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { UserAvailability, DayOfWeek } from '../../domain/entities/user-availability.entity';
import { UserAvailabilitySchema } from '../../database/schemas/user-availability.schema';

export class UserAvailabilityAdapter implements IUserAvailabilityRepository {
  private repository: Repository<UserAvailabilitySchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserAvailabilitySchema);
  }

  async findById(id: number): Promise<UserAvailability | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: number): Promise<UserAvailability[]> {
    const schemas = await this.repository.find({
      where: { userId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async findByUserIdAndDay(userId: number, dayOfWeek: DayOfWeek): Promise<UserAvailability[]> {
    const schemas = await this.repository.find({
      where: { userId, dayOfWeek },
      order: { startTime: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async create(availability: UserAvailability): Promise<UserAvailability> {
    const schema = this.toSchema(availability);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(availability: UserAvailability): Promise<UserAvailability> {
    const schema = this.toSchema(availability);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  async deleteByUserIdAndDay(userId: number, dayOfWeek: DayOfWeek): Promise<void> {
    await this.repository.delete({ userId, dayOfWeek });
  }

  private toDomain(schema: UserAvailabilitySchema): UserAvailability {
    return new UserAvailability(
      schema.id,
      schema.userId,
      schema.dayOfWeek as DayOfWeek,
      schema.startTime,
      schema.endTime,
      schema.createdAt,
      schema.updatedAt
    );
  }

  private toSchema(availability: UserAvailability): UserAvailabilitySchema {
    const schema = new UserAvailabilitySchema();
    schema.id = availability.id;
    schema.userId = availability.userId;
    schema.dayOfWeek = availability.dayOfWeek;
    schema.startTime = availability.startTime;
    schema.endTime = availability.endTime;
    schema.createdAt = availability.createdAt;
    schema.updatedAt = availability.updatedAt;
    return schema;
  }
}
