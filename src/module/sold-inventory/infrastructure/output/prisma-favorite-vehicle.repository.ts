import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { IFavoriteVehicleRepository } from '../../domain/entities/favorite-vehicle.repository';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class PrismaFavoriteVehicleRepository
  implements IFavoriteVehicleRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async updateManyByVehiclesIds(
    accountId: string,
    vehiclesIds: string[],
  ): Promise<void> {
    await this.prisma.favoriteVehicle.updateMany({
      data: { deletedNotificationStatus: NotificationStatus.SENT },
      where: {
        accountId,
        vehicleId: {
          in: vehiclesIds,
        },
      },
    });
  }

  async updateManyByIds(ids: string[]) {
    await this.prisma.favoriteVehicle.updateMany({
      data: { deletedNotificationStatus: NotificationStatus.SENT },
      where: {
        id: { in: ids },
      },
    });
  }
}
