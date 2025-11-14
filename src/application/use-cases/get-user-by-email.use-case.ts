import { IUserRepository } from "../../domain/interfaces/user.repository.interface";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string) {
    if (!email) {
      throw { http_status: 400, message: "Email is required" };
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw { http_status: 404, message: "User not found" };
    }

    return {
      success: true,
      data: user
    };
  }
}
