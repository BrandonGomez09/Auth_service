import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsOptional,
  Matches,
  IsNumber,
  IsPositive,
  ValidateNested,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

class ResponsibleDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  names: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  firstLastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  secondLastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;

  @IsOptional()
  @IsString()
  @Length(10, 50)
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid phone number format' })
  phoneNumber?: string;

  @IsNumber()
  @IsPositive()
  stateId: number;

  @IsNumber()
  @IsPositive()
  municipalityId: number;
}

class KitchenDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 50)
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid phone number format' })
  contactPhone: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

class LocationDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  neighborhood: string;

  @IsNumber()
  @IsPositive()
  stateId: number;

  @IsNumber()
  @IsPositive()
  municipalityId: number;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  @Matches(/^\d{5}$/, { message: 'Postal code must be exactly 5 digits' })
  postalCode: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  capacity?: number;
}

export class RegisterKitchenAdminDto {
  @ValidateNested()
  @Type(() => ResponsibleDataDto)
  @IsNotEmpty()
  responsibleData: ResponsibleDataDto;

  @ValidateNested()
  @Type(() => KitchenDataDto)
  @IsNotEmpty()
  kitchenData: KitchenDataDto;

  @ValidateNested()
  @Type(() => LocationDataDto)
  @IsNotEmpty()
  locationData: LocationDataDto;
}