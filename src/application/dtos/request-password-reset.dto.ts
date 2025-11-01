import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  constructor(email: string) {
    this.email = email;
  }
}