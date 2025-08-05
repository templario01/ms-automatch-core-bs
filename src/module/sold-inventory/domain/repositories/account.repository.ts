import { Injectable } from '@nestjs/common';
import { FavoriteVehicle } from '../entities/favorite-vehicle';
import { Account } from '../entities/account';

@Injectable()
export abstract class IAccountRepository {
  abstract getAccountWithFavoriteVehiclesByVehicleId(
    vehicleIds: string[],
  ): Promise<Account[]>;
}
