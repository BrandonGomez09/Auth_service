import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyPhoneDto {
  @IsNotEmpty({ message: 'User ID is required' })
  public userId: number;

  @IsNotEmpty({ message: 'Code is required' })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Code must contain only numbers' })
  public code: string;

  constructor(userId: number, code: string) {
    this.userId = userId;
    this.code = code;
  }
}