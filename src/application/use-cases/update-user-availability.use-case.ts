import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserAvailability, DayOfWeek } from '../../domain/entities/user-availability.entity';

export class UpdateUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: {
    userId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }): Promise<UserAvailability> {
    if (!dto.userId || !dto.dayOfWeek || !dto.startTime || !dto.endTime) {
      throw new Error('User ID, dayOfWeek, startTime, and endTime are required');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new Error('User not found');

    if (dto.startTime >= dto.endTime) {
      throw new Error('Invalid time range: start time must be before end time');
    }

    const existing = await this.userAvailabilityRepository.findByUserIdAndDay(
      dto.userId,
      dto.dayOfWeek
    );

    if (existing.length === 0) {
      throw new Error(`No existing availability found for ${dto.dayOfWeek}`);
    }

    const updatedAvailability = new UserAvailability(
      existing[0].id,
      dto.userId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      existing[0].createdAt,
      new Date()
    );

    return await this.userAvailabilityRepository.update(updatedAvailability);
  }
}
