import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveRoleDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  public userId: number;

  @IsNotEmpty({ message: 'Role ID is required' })
  @IsNumber()
  public roleId: number;

  constructor(userId: number, roleId: number) {
    this.userId = userId;
    this.roleId = roleId;
  }
}