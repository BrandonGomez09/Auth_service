import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer'; 
import { DayOfWeek } from '../../domain/entities/user-availability.entity'; 

export class AvailabilitySlotDto {
  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in format HH:mm'
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in format HH:mm'
  })
  endTime: string;

  constructor(dayOfWeek: DayOfWeek, startTime: string, endTime: string) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  names: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  firstLastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  secondLastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @Length(10, 50)
  phoneNumber?: string;

  @IsNotEmpty()
  @IsNumber()
  stateId: number;

  @IsNotEmpty()
  @IsNumber()
  municipalityId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skillIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availabilitySlots?: AvailabilitySlotDto[];

  constructor(
    names: string,
    firstLastName: string,
    secondLastName: string,
    email: string,
    password: string,
    stateId: number,
    municipalityId: number,
    phoneNumber?: string,
    skillIds?: number[],
    availabilitySlots?: AvailabilitySlotDto[] 
  ) {
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.password = password;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
    this.phoneNumber = phoneNumber;
    this.skillIds = skillIds;
    this.availabilitySlots = availabilitySlots;
  }
}