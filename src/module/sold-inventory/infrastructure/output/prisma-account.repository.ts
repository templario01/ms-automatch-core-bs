import { Injectable } from '@nestjs/common';
import { NotificationStatus } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { Account } from '../../domain/entities/account';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { AccountWithRelations } from 'src/core/database/types/account.type';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAccountWithFavoriteVehiclesByVehicleId(
    vehicleIds: string[],
  ): Promise<Account[]> {
    const accounts: Awaited<AccountWithRelations[]> =
      await this.prisma.account.findMany({
        where: {
          favoriteVehicles: {
            some: {
              vehicleId: {
                in: vehicleIds,
              },
              deletedNotificationStatus: {
                in: [
                  NotificationStatus.FAILED,
                  NotificationStatus.READY_TO_SEND,
                  NotificationStatus.WAITING,
                ],
              },
            },
          },
        },
        include: {
          user: true,
          favoriteVehicles: {
            where: {
              vehicleId: {
                in: vehicleIds,
              },
              deletedNotificationStatus: {
                in: [
                  NotificationStatus.FAILED,
                  NotificationStatus.READY_TO_SEND,
                  NotificationStatus.WAITING,
                ],
              },
            },
          },
        },
      });

    return accounts.map(Account.mapToObject);
  }
}
