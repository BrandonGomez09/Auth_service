import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserSkill } from '../../domain/entities/user-skill.entity';
import { UserAvailability } from '../../domain/entities/user-availability.entity';

export interface FullProfileResponse {
  user: User;
  skills: UserSkill[];
  availability: UserAvailability[];
}

export class GetMyProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly userAvailabilityRepository: IUserAvailabilityRepository
  ) {}

  async execute(userId: number): Promise<FullProfileResponse> {
    if (!userId) {
      throw { http_status: 401, message: 'Unauthorized: User ID missing from token' };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { http_status: 404, message: 'User profile not found' };
    }

    const skills = await this.userSkillRepository.findByUserId(userId);
    const availability = await this.userAvailabilityRepository.findByUserId(userId);

    return {
      user,
      skills,
      availability
    };
  }
}