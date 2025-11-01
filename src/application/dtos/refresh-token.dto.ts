import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString()
  public refreshToken: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}