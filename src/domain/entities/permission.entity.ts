import { IsNotEmpty, IsNumber, IsString, IsOptional, Length } from 'class-validator';

export class Permission {
  @IsOptional()
  @IsNumber()
  public id: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  public module: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  public action: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  public resource: string;

  @IsOptional()
  @IsString()
  public description: string | null;

  constructor(
    id: number,
    module: string,
    action: string,
    resource: string,
    description: string | null
  ) {
    this.id = id;
    this.module = module;
    this.action = action;
    this.resource = resource;
    this.description = description;
  }
}