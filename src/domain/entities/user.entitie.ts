import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
  Max
} from 'class-validator';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export class User {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Length(2, 255)
  names: string;

  @IsNotEmpty()
  @Length(2, 255)
  firstLastName: string;

  @IsNotEmpty()
  @Length(2, 255)
  secondLastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsOptional()
  imageProfile?: string | null;

  @IsOptional()
  @Length(10, 50)
  phoneNumber?: string | null;

  @IsNumber()
  @Min(0)
  @Max(100)
  reputationScore: number;

  @IsOptional()
  googleUserId?: string | null;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsBoolean()
  verifiedEmail: boolean;

  @IsBoolean()
  verifiedPhone: boolean;

  @IsOptional()
  @IsNumber()
  stateId?: number | null;

  @IsOptional()
  @IsNumber()
  municipalityId?: number | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number | null;

  constructor(
    id: number,
    names: string,
    firstLastName: string,
    secondLastName: string,
    email: string,
    passwordHash: string,
    imageProfile: string | null,
    phoneNumber: string | null,
    reputationScore: number,
    googleUserId: string | null,
    status: UserStatus,
    verifiedEmail: boolean,
    verifiedPhone: boolean,
    stateId: number | null,
    municipalityId: number | null,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number | null
  ) {
    this.id = id;
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.imageProfile = imageProfile;
    this.phoneNumber = phoneNumber;
    this.reputationScore = reputationScore;
    this.googleUserId = googleUserId;
    this.status = status;
    this.verifiedEmail = verifiedEmail;
    this.verifiedPhone = verifiedPhone;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }
}
