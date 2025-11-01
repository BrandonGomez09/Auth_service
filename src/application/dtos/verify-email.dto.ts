import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  @IsUUID('4', { message: 'Invalid token format' })
  public token: string;

  constructor(token: string) {
    this.token = token;
  }
}