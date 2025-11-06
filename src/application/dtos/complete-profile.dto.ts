import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray
} from 'class-validator';

export class CompleteProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skillIds?: number[];

  constructor(userId: number, skillIds?: number[]) {
    this.userId = userId;
    this.skillIds = skillIds;
  }
}