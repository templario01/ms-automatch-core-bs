import { Injectable } from '@nestjs/common';
import { IFavoriteVehicleRepository } from '../domain/repositories/favorite-vehicle.repository';
import { FavoriteVehicle } from '../domain/entities/favorite-vehicle';

@Injectable()
export class GetAllFavoriteVehiclesUseCase {
  constructor(
    private readonly favoriteVehicleRepository: IFavoriteVehicleRepository,
  ) {}

  async execute(accountId: string): Promise<FavoriteVehicle[]> {
    return this.favoriteVehicleRepository.findFavoriteVehiclesByAccountId(
      accountId,
    );
  }
}
