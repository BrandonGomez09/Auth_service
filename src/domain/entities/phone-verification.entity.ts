import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsDate, IsOptional, Length, Min } from 'class-validator';

export class PhoneVerification {
  @IsOptional()
  @IsNumber()
  public id: number;

  @IsNotEmpty()
  @IsNumber()
  public userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 10)
  public code: string;

  @IsNotEmpty()
  @IsDate()
  public expiresAt: Date;

  @IsBoolean()
  public isUsed: boolean;

  @IsNumber()
  @Min(0)
  public attempts: number;

  @IsDate()
  public createdAt: Date;

  @IsOptional()
  @IsDate()
  public usedAt: Date | null;

  constructor(
    id: number,
    userId: number,
    code: string,
    expiresAt: Date,
    isUsed: boolean,
    attempts: number,
    createdAt: Date,
    usedAt: Date | null
  ) {
    this.id = id;
    this.userId = userId;
    this.code = code;
    this.expiresAt = expiresAt;
    this.isUsed = isUsed;
    this.attempts = attempts;
    this.createdAt = createdAt;
    this.usedAt = usedAt;
  }
}