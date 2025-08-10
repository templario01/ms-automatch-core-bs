import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/database/prisma.module';
import { AccountController } from './infrastructure/input/controllers/favorite-vehicle.controller';
import { AddFavoriteVehicleUseCase } from './application/add-favorite-vehicle.use-case';
import { RemoveFavoriteVehicleUseCase } from './application/remove-favorite-vehicle.use-case';
import { IFavoriteVehicleRepository } from './domain/repositories/favorite-vehicle.repository';
import { PrismaFavoriteVehicleRepository } from './infrastructure/output/prisma-favorite-vehicle.repository';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from 'src/core/settings/env-config.module';
import { IAuthRepository } from '../auth/domain/repositories/auth.repository';
import { PrismaAuthRepository } from '../auth/infrastructure/output/prisma-auth.repository';

const useCases = [AddFavoriteVehicleUseCase, RemoveFavoriteVehicleUseCase];
const repositories = [
  {
    provide: IFavoriteVehicleRepository,
    useClass: PrismaFavoriteVehicleRepository,
  },
    {
    provide: IAuthRepository,
    useClass: PrismaAuthRepository,
  },
];

@Module({
  imports: [PrismaModule, JwtModule, EnvConfigModule],
  controllers: [AccountController],
  providers: [...useCases, ...repositories],
})
export class AccountModule {}
