import { Permission } from '../entities/permission.entity';

export interface IPermissionRepository {
  save(permission: Permission): Promise<Permission>;
  findById(id: number): Promise<Permission | null>;
  findByModuleActionResource(module: string, action: string, resource: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByModule(module: string): Promise<Permission[]>;
  update(id: number, permission: Partial<Permission>): Promise<Permission>;
  delete(id: number): Promise<void>;
  assignPermissionToRole(roleId: number, permissionId: number): Promise<void>;
  removePermissionFromRole(roleId: number, permissionId: number): Promise<void>;
  getRolePermissions(roleId: number): Promise<Permission[]>;
  getUserPermissions(userId: number): Promise<Permission[]>;
  userHasPermission(userId: number, module: string, action: string, resource: string): Promise<boolean>;
}