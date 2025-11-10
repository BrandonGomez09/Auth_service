import axios from 'axios';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

export class GetNearbyKitchensUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly kitchenServiceUrl: string
  ) {}

  async execute(userId: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.stateId || !user.municipalityId) {
      throw new Error('El usuario no tiene ubicación registrada');
    }

    const response = await axios.get(
      `${this.kitchenServiceUrl}/api/kitchens/nearby`,
      {
        params: {
          stateId: user.stateId,
          municipalityId: user.municipalityId
        }
      }
    );

    return response.data;
  }
}
