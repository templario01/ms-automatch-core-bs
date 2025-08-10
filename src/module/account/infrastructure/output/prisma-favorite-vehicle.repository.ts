import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { FavoriteVehicle } from '../../domain/entities/favorite-vehicle';
import { IFavoriteVehicleRepository } from '../../domain/repositories/favorite-vehicle.repository';

@Injectable()
export class PrismaFavoriteVehicleRepository implements IFavoriteVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFavoriteVehicle(
    accountId: string,
    vehicleId: string,
  ): Promise<void> {
    await this.prisma.favoriteVehicle.create({
      data: {
        accountId,
        vehicleId,
      },
    });
  }

  async deleteFavoriteVehicle(id: string): Promise<void> {
    await this.prisma.favoriteVehicle.delete({
      where: {
        id,
      },
    });
  }

  async findFavoriteVehiclesByAccountId(
    accountId: string,
  ): Promise<FavoriteVehicle[]> {
    const favoriteVehicles = await this.prisma.favoriteVehicle.findMany({
      where: {
        accountId,
      },
    });

    return favoriteVehicles.map(FavoriteVehicle.mapToObject);
  }
}
