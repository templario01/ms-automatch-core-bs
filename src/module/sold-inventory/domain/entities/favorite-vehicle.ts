import { FavoriteVehicle as PrismaFavoriteVehicle } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export class FavoriteVehicle {
  readonly id: string;
  readonly accountId: string;
  readonly vehicleId: string;
  readonly deletedNotificationStatus: string;

  static mapToObject(data: PrismaFavoriteVehicle): FavoriteVehicle {
    if (!data) return null;
    return plainToInstance(FavoriteVehicle, {
      id: data.id,
      accountId: data.accountId,
      vehicleId: data.vehicleId,
      deletedNotificationStatus: data.deletedNotificationStatus,
    } as FavoriteVehicle);
  }
}
