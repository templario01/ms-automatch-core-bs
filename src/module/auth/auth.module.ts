import { Module } from '@nestjs/common';
import { ResendAuthVerificationCodeUseCase } from './application/resend-auth-verification-code.use-case';
import { IUserRepository } from './domain/repositories/auth.repository';
import { PrismaUserRepository } from './infrastructure/output/prisma-user.repository';
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
import { GoogleAuthController } from './infrastructure/input/controllers/google-auth.controller';
import { SignInWithGoogleUseCase } from './application/sign-in-with-google.use-case';
import { GoogleAuthService } from './application/services/google.auth.service';
import { ConfirmAccountUseCase } from './application/confirm-account.use-case';
import { LoginUserUseCase } from './application/login-user.use-case';
import { RegisterUserUseCase } from './application/register-user.use-case';
import { SendAuthVerificationCodeUseCase } from './application/send-auth-verification-code.use-case';

const useCases = [
  ResendAuthVerificationCodeUseCase,
  ConfirmAccountUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  SendAuthVerificationCodeUseCase,
  SignInWithGoogleUseCase,
];
const repositories = [
  { provide: IUserRepository, useClass: PrismaUserRepository },
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
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, GoogleAuthService, ...useCases, ...repositories],
})
export class AuthModule {}
