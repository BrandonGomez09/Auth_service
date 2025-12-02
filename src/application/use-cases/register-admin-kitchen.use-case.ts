import { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { IRoleRepository } from "../../domain/interfaces/role.repository.interface";
import { User, UserStatus } from "../../domain/entities/user.entity";
import { rabbitmqConfig } from "../../config/rabbitmq.config";
import { RabbitMQEventPublisherService } from "../../services/rabbitmq-event-publisher.service";

export class RegisterAdminKitchenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly publisher: RabbitMQEventPublisherService
  ) {}

  async execute(data: any) {
    const {
      names,
      firstLastName,
      secondLastName,
      email,
      phoneNumber,
      password,
      kitchenId
    } = data;

    if (!names || !firstLastName || !email || !phoneNumber || !password || !kitchenId) {
      throw { http_status: 400, message: "Missing required fields" };
    }

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const newUser = new User(
        0,
        names,
        firstLastName,
        secondLastName ?? "",
        email,
        password, 
        null,
        phoneNumber,
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

      user = await this.userRepository.save(newUser);

      const role = await this.roleRepository.findByName("Admin_cocina");
      if (!role) {
        throw { http_status: 404, message: "Role 'Admin_cocina' not found" };
      }

      await this.roleRepository.assignRoleToUser(user.id, role.id);
    } else {
      console.log("ℹ️ [AUTH] Usuario ya existía, se reutilizará:");
    }

    await this.publisher.publish(
      rabbitmqConfig.routingKeys.kitchenAdminUserSynced,
      {
        kitchenId,
        userId: user.id
      }
    );

    console.log("📤 [AUTH] kitchen.admin.userId.synced →", {
      kitchenId,
      userId: user.id
    });

    return { success: true };
  }
}