import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(1, 128)
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}