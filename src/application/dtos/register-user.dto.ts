import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsNumber
} from 'class-validator';

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

  constructor(
    names: string,
    firstLastName: string,
    secondLastName: string,
    email: string,
    password: string,
    stateId: number,
    municipalityId: number,
    phoneNumber?: string
  ) {
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.password = password;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
    this.phoneNumber = phoneNumber;
  }
}