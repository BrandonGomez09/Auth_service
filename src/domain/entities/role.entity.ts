import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional, Length, Min } from 'class-validator';

export class Role {
  @IsOptional()
  @IsNumber()
  public id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  public name: string;

  @IsOptional()
  @IsString()
  public description: string | null;

  @IsNotEmpty({ message: 'Level is required' })
  @IsNumber()
  @Min(1)
  public level: number;

  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;

  constructor(
    id: number,
    name: string,
    description: string | null,
    level: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.level = level;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}