import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsDate, IsOptional, Length } from 'class-validator';

export class EmailVerification {
  @IsOptional()
  @IsNumber()
  public id: number;

  @IsNotEmpty()
  @IsNumber()
  public userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  public token: string;

  @IsNotEmpty()
  @IsDate()
  public expiresAt: Date;

  @IsBoolean()
  public isUsed: boolean;

  @IsDate()
  public createdAt: Date;

  @IsOptional()
  @IsDate()
  public usedAt: Date | null;

  constructor(
    id: number,
    userId: number,
    token: string,
    expiresAt: Date,
    isUsed: boolean,
    createdAt: Date,
    usedAt: Date | null
  ) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isUsed = isUsed;
    this.createdAt = createdAt;
    this.usedAt = usedAt;
  }
}