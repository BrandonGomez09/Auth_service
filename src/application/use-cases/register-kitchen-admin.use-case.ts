import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';

export class RegisterKitchenAdminUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: any): Promise<{ message: string }> {
    if (!dto.email || !dto.password || !dto.names || !dto.firstLastName) {
      throw { http_status: 400, message: 'Faltan datos obligatorios para el registro' };
    }

    const user = new User(
      0,
      dto.names,
      dto.firstLastName,
      dto.secondLastName || '',
      dto.email,
      dto.password,
      null,
      dto.phoneNumber || null,          
      0,
      null,
      UserStatus.PENDING,
      false,
      false,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
      null
    );

    const createdUser = await this.userRepository.save(user);

    const adminRole = await this.roleRepository.findByName('AdminCocina');
    if (!adminRole) {
      throw { http_status: 404, message: 'El rol AdminCocina no existe' };
    }

    await this.roleRepository.assignRoleToUser(createdUser.id, adminRole.id);

    await this.eventPublisher.publish('kitchen.requested', {
      userId: createdUser.id,
      fullName: `${createdUser.names} ${createdUser.firstLastName} ${createdUser.secondLastName}`,
      email: createdUser.email,
      kitchenName: dto.kitchenName,
      description: dto.description,
      contact: {
        phone: dto.kitchenContactPhone,
        email: dto.kitchenContactEmail
      },
      location: {
        address: dto.address,
        colony: dto.colony,
        state: dto.state,
        postalCode: dto.postalCode
      },
      timestamp: new Date().toISOString()
    });

    return { message: 'Administrador de cocina registrado exitosamente' };
  }
}
