import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  public userId: number;

  @IsNotEmpty({ message: 'Role ID is required' })
  @IsNumber()
  public roleId: number;

  @IsOptional()
  @IsBoolean()
  public isPrimary?: boolean;

  @IsOptional()
  @IsNumber()
  public assignedBy?: number;

  constructor(
    userId: number,
    roleId: number,
    isPrimary?: boolean,
    assignedBy?: number
  ) {
    this.userId = userId;
    this.roleId = roleId;
    this.isPrimary = isPrimary;
    this.assignedBy = assignedBy;
  }
}