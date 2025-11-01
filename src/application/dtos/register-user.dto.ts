import { IsEmail, IsNotEmpty, Length, IsOptional, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Names is required' })
  @Length(2, 255, { message: 'Names must be between 2 and 255 characters' })
  public names: string;

  @IsNotEmpty({ message: 'First last name is required' })
  @Length(2, 255, { message: 'First last name must be between 2 and 255 characters' })
  public firstLastName: string;

  @IsNotEmpty({ message: 'Second last name is required' })
  @Length(2, 255, { message: 'Second last name must be between 2 and 255 characters' })
  public secondLastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character'
  })
  public password: string;

  @IsOptional()
  @Length(10, 50)
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number format' })
  public phoneNumber?: string;

  constructor(
    names: string,
    firstLastName: string,
    secondLastName: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) {
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }
}