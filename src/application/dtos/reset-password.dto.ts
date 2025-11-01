import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  @IsUUID('4', { message: 'Invalid token format' })
  public token: string;

  @IsNotEmpty({ message: 'New password is required' })
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character'
  })
  public newPassword: string;

  constructor(token: string, newPassword: string) {
    this.token = token;
    this.newPassword = newPassword;
  }
}