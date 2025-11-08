import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { UserStatus } from '../../domain/entities/user.entity';

export class AssignVolunteerRoleUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) { }

  async execute(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    const volunteerRole = await this.roleRepository.findByName('Voluntario');
    if (!volunteerRole) {
      throw {
        http_status: 500,
        message: 'Volunteer role not found in system'
      };
    }

    await this.roleRepository.assignRoleToUser(user.id, volunteerRole.id);
    user.status = UserStatus.ACTIVE;
    await this.userRepository.update(user);
  }
}