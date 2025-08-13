import { Injectable } from '@nestjs/common';
import { FavoriteVehicle } from '../entities/favorite-vehicle';

@Injectable()
export abstract class IFavoriteVehicleRepository {
  abstract createFavoriteVehicle(
    accountId: string,
    vehicleId: string,
  ): Promise<void>;
  abstract deleteFavoriteVehicle(accountId: string, id: string): Promise<void>;
  abstract findFavoriteVehiclesByAccountId(
    accountId: string,
  ): Promise<FavoriteVehicle[]>;
}
