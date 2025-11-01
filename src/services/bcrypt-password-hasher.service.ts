import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../domain/interfaces/password-hasher.interface';

export class BcryptPasswordHasherService implements IPasswordHasher {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}