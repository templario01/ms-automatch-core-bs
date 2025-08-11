import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/database/prisma.module';
import { FavoriteVehicleController } from './infrastructure/input/controllers/favorite-vehicle.controller';
import { AddFavoriteVehicleUseCase } from './application/add-favorite-vehicle.use-case';
import { RemoveFavoriteVehicleUseCase } from './application/remove-favorite-vehicle.use-case';
import { IFavoriteVehicleRepository } from './domain/repositories/favorite-vehicle.repository';
import { PrismaFavoriteVehicleRepository } from './infrastructure/output/prisma-favorite-vehicle.repository';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from 'src/core/settings/env-config.module';
import { IAuthRepository } from '../auth/domain/repositories/auth.repository';
import { PrismaAuthRepository } from '../auth/infrastructure/output/prisma-auth.repository';
import { GetAllFavoriteVehiclesUseCase } from './application/get-all-favorite-vehicles.use.case';
import { AccountController } from './infrastructure/input/controllers/account.controller';
import { GetAccountInformationUseCase } from './application/get-account-information.use-case';
import { AccountRepository } from './infrastructure/output/prisma-account.repository';
import { IAccountRepository } from './domain/repositories/account.repository';
import { UpdateAccountUseCase } from './application/update-account.use-case';

const useCases = [
  AddFavoriteVehicleUseCase,
  RemoveFavoriteVehicleUseCase,
  GetAllFavoriteVehiclesUseCase,
  GetAccountInformationUseCase,
  UpdateAccountUseCase,
];
const repositories = [
  {
    provide: IFavoriteVehicleRepository,
    useClass: PrismaFavoriteVehicleRepository,
  },
  {
    provide: IAuthRepository,
    useClass: PrismaAuthRepository,
  },
  {
    provide: IAccountRepository,
    useClass: AccountRepository,
  },
];

@Module({
  imports: [PrismaModule, JwtModule, EnvConfigModule],
  controllers: [AccountController, FavoriteVehicleController],
  providers: [...useCases, ...repositories],
})
export class AccountModule {}
