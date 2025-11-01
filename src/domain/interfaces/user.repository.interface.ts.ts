import { User } from '../entities/user.entitie';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleUserId(googleUserId: string): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  findAll(): Promise<User[]>;
  findByStatus(status: string): Promise<User[]>;
}