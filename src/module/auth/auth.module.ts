import { Module } from '@nestjs/common';
import { AuthUseCase } from './application/auth.use-case';
import { IAuthRepository } from './domain/repositories/auth.repository';
import { PrismaAuthRepository } from './infrastructure/output/prisma-auth.repository';
import { PrismaModule } from '../../core/database/prisma.module';
import { AuthController } from './infrastructure/input/controllers/auth.controller';
import { IVerificationCodeRepository } from './domain/repositories/verification-code.repository';
import { PrismaVerificationCodeRepository } from './infrastructure/output/prisma-verification-code.repository';
import { AuthService } from './application/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '../../core/settings/env-config.module';
import { EnvConfigService } from '../../core/settings/env-config.service';
import { BrokerModule } from '../../core/event-broker/broker.module';
import { AUTOMATCH_EMAIL_NOTIFICATION } from '../../core/event-broker/dtos/services';


const useCases = [AuthUseCase];
const repositories = [
  { provide: IAuthRepository, useClass: PrismaAuthRepository },
  {
    provide: IVerificationCodeRepository,
    useClass: PrismaVerificationCodeRepository,
  },
];

@Module({
  imports: [
    PrismaModule,
    EnvConfigModule,
    BrokerModule.register({ name: AUTOMATCH_EMAIL_NOTIFICATION }),
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (envConfigService: EnvConfigService) => {
        const { expirationTime, secret } = envConfigService.jwtConfig;

        return {
          global: true,
          signOptions: { expiresIn: expirationTime },
          secret,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...useCases, ...repositories],
})
export class AuthModule {}
