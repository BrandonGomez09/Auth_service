import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { DayOfWeek, UserAvailability } from '../../domain/entities/user-availability.entity';

export class SetUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: any): Promise<{
    message: string;
    userId: number;
    updatedSlots: UserAvailability[];
  }> {
    if (!dto.userId || !Array.isArray(dto.availabilitySlots)) {
      throw new Error('User ID and valid availabilitySlots array are required');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new Error('User not found');

    const currentAvailabilities = await this.userAvailabilityRepository.findByUserId(dto.userId);

    const incomingMap = new Map(
      dto.availabilitySlots.map((slot: any) => [slot.dayOfWeek, slot])
    );

    const updatedSlots: UserAvailability[] = [];

    for (const existing of currentAvailabilities) {
      const incoming = incomingMap.get(existing.dayOfWeek) as { startTime: string; endTime: string } | undefined;

      if (!incoming) {
        await this.userAvailabilityRepository.delete(existing.id);
      } else {
        if (
          existing.startTime !== incoming.startTime ||
          existing.endTime !== incoming.endTime
        ) {
          existing.startTime = incoming.startTime;
          existing.endTime = incoming.endTime;
          existing.updatedAt = new Date();

          const updated = await this.userAvailabilityRepository.update(existing);
          updatedSlots.push(updated);
        } else {
          updatedSlots.push(existing);
        }

        incomingMap.delete(existing.dayOfWeek);
      }
    }

    for (const [dayOfWeek, slot] of incomingMap.entries()) {
      const typedSlot = slot as { startTime: string; endTime: string };
      const newAvailability = new UserAvailability(
        0,
        dto.userId,
        DayOfWeek[dayOfWeek as keyof typeof DayOfWeek],
        typedSlot.startTime,
        typedSlot.endTime,
        new Date(),
        new Date()
      );

      const created = await this.userAvailabilityRepository.create(newAvailability);
      updatedSlots.push(created);
    }

    return {
      message: 'Disponibilidad actualizada correctamente',
      userId: dto.userId,
      updatedSlots
    };
  }
}
