import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';

export class RegisterAdminKitchenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(data: any) {
    if (!data.names || !data.firstLastName || !data.email || !data.passwordHash) {
      throw { http_status: 400, message: 'Missing required fields' };
    }

    const exists = await this.userRepository.findByEmail(data.email);
    if (exists) {
      throw { http_status: 409, message: 'Email already registered' };
    }

    const user = new User(
      0,
      data.names,
      data.firstLastName,
      data.secondLastName || '',
      data.email,
      data.passwordHash,
      null,
      data.phoneNumber || null,
      0,
      null,
      UserStatus.ACTIVE,
      true,
      true,
      new Date(),
      new Date(),
      null,
      null,
      new Date(),
      new Date(),
      null
    );

    const newUser = await this.userRepository.save(user);

    const role = await this.roleRepository.findByName('Admin_cocina');
    if (!role) {
      throw { http_status: 500, message: 'Role Admin_cocina not found' };
    }

    await this.roleRepository.assignRoleToUser(newUser.id, role.id);

    return {
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        role: 'Admin_cocina'
      }
    };
  }
}
