import { Injectable } from '@nestjs/common';
import { IFavoriteVehicleRepository } from '../domain/repositories/favorite-vehicle.repository';

@Injectable()
export class RemoveFavoriteVehicleUseCase {
  constructor(
    private readonly favoriteVehicleRepository: IFavoriteVehicleRepository,
  ) {}

  async execute(accountId: string, vehicleId: string): Promise<void> {
    await this.favoriteVehicleRepository.deleteFavoriteVehicle(
      accountId,
      vehicleId,
    );
  }
}
