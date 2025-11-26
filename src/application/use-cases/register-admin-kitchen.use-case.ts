import { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { IRoleRepository } from "../../domain/interfaces/role.repository.interface";
import { User, UserStatus } from "../../domain/entities/user.entity";
import { BcryptPasswordHasherService } from "../../services/bcrypt-password-hasher.service";

export class RegisterAdminKitchenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly hasher: BcryptPasswordHasherService
  ) {}

  async execute(data: any) {
    const { names, firstLastName, secondLastName, email, phoneNumber, password } = data;

    if (!names || !firstLastName || !email || !phoneNumber || !password) {
      throw { http_status: 400, message: "Missing required fields" };
    }

    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw { http_status: 409, message: "Email already registered" };

    const passwordHash = await this.hasher.hash(password);

    const user = new User(
      0,
      names,
      firstLastName,
      secondLastName ?? "",
      email,
      passwordHash,
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

    const newUser = await this.userRepository.save(user);

    const role = await this.roleRepository.findByName("Admin_cocina");
    if (!role) {
      throw { http_status: 404, message: "Role 'Admin_cocina' not found" };
    }
    await this.roleRepository.assignRoleToUser(newUser.id, role.id);

    return { success: true };
  }
}