import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  public token: string;

  constructor(token: string) {
    this.token = token;
  }
}