import { Module } from '@nestjs/common';
import { BrokerModule } from 'src/core/event-broker/broker.module';
import { SoldInventoryController } from './infrastructure/input/controllers/sold-inventory.controller';
import { NotifyUsersSoldVehiclesUseCase } from './application/notify-users-sold-vehicles.use-case';
import { IAccountRepository } from './domain/repositories/account.repository';
import { PrismaAccountRepository } from './infrastructure/output/prisma-account.repository';
import { AUTOMATCH_EMAIL_NOTIFICATION } from 'src/core/event-broker/dtos/services';
import { PrismaModule } from 'src/core/database/prisma.module';
import { IFavoriteVehicleRepository } from './domain/entities/favorite-vehicle.repository';
import { PrismaFavoriteVehicleRepository } from './infrastructure/output/prisma-favorite-vehicle.repository';

const useCases = [NotifyUsersSoldVehiclesUseCase];
const repositories = [
  { provide: IAccountRepository, useClass: PrismaAccountRepository },
  {
    provide: IFavoriteVehicleRepository,
    useClass: PrismaFavoriteVehicleRepository,
  },
];

@Module({
  imports: [
    PrismaModule,
    BrokerModule.register({ name: AUTOMATCH_EMAIL_NOTIFICATION }),
  ],
  controllers: [SoldInventoryController],
  providers: [...useCases, ...repositories],
})
export class SoldInventoryModule {}
