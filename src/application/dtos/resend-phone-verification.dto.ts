import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResendPhoneVerificationDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  public userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}