import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IFavoriteVehicleRepository {
  abstract updateManyByVehiclesIds(
    accountId: string,
    vehiclesIds: string[],
  ): Promise<void>;
  abstract updateManyByIds(ids: string[]): Promise<void>;
}
