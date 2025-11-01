import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { UserSchema } from '../../database/schemas/user.schema';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { User, UserStatus } from '../../domain/entities/user.entitie';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserSchema);
  }

  async save(user: User): Promise<User> {
    const userSchema = this.repository.create({
      names: user.names,
      firstLastName: user.firstLastName,
      secondLastName: user.secondLastName,
      email: user.email,
      passwordHash: user.passwordHash,
      imageProfile: user.imageProfile,
      phoneNumber: user.phoneNumber,
      reputationScore: user.reputationScore,
      googleUserId: user.googleUserId,
      status: user.status,
      verifiedEmail: user.verifiedEmail,
      verifiedPhone: user.verifiedPhone,
      stateId: user.stateId,
      municipalityId: user.municipalityId,
      createdBy: user.createdBy
    });

    const savedUser = await this.repository.save(userSchema);
    return this.toDomain(savedUser);
  }

  async findById(id: number): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { id } });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { email } });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async findByGoogleUserId(googleUserId: string): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { googleUserId } });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.repository.update(id, {
      ...(user.names && { names: user.names }),
      ...(user.firstLastName && { firstLastName: user.firstLastName }),
      ...(user.secondLastName && { secondLastName: user.secondLastName }),
      ...(user.email && { email: user.email }),
      ...(user.passwordHash && { passwordHash: user.passwordHash }),
      ...(user.imageProfile !== undefined && { imageProfile: user.imageProfile }),
      ...(user.phoneNumber !== undefined && { phoneNumber: user.phoneNumber }),
      ...(user.reputationScore !== undefined && { reputationScore: user.reputationScore }),
      ...(user.status && { status: user.status }),
      ...(user.verifiedEmail !== undefined && { verifiedEmail: user.verifiedEmail }),
      ...(user.verifiedPhone !== undefined && { verifiedPhone: user.verifiedPhone }),
      ...(user.stateId !== undefined && { stateId: user.stateId }),
      ...(user.municipalityId !== undefined && { municipalityId: user.municipalityId }),
      updatedAt: new Date()
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('User not found after update');
    }
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async findAll(): Promise<User[]> {
    const users = await this.repository.find();
    return users.map(user => this.toDomain(user));
  }

  async findByStatus(status: string): Promise<User[]> {
    const users = await this.repository.find({ where: { status: status as UserStatus } });
    return users.map(user => this.toDomain(user));
  }

  private toDomain(schema: UserSchema): User {
    return new User(
      schema.id,
      schema.names,
      schema.firstLastName,
      schema.secondLastName,
      schema.email,
      schema.passwordHash,
      schema.imageProfile,
      schema.phoneNumber,
      Number(schema.reputationScore),
      schema.googleUserId,
      schema.status,
      schema.verifiedEmail,
      schema.verifiedPhone,
      schema.stateId,
      schema.municipalityId,
      schema.createdAt,
      schema.updatedAt,
      schema.createdBy
    );
  }
}