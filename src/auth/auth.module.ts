import { Module } from '@nestjs/common';
import { AuthUseCase } from './application/auth.use-case';
import { IAuthRepository } from './domain/repositories/auth.repository';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { PrismaModule } from '../core/database/prisma.module';
import { AuthController } from './infrastructure/api/controllers/auth.controller';
import { IVerificationCodeRepository } from './domain/repositories/verification-code.repository';
import { PrismaVerificationCodeRepository } from './infrastructure/prisma-verification-code.repository';

const useCases = [AuthUseCase];
const repositories = [
  { provide: IAuthRepository, useClass: PrismaAuthRepository },
  {
    provide: IVerificationCodeRepository,
    useClass: PrismaVerificationCodeRepository,
  },
];

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [...useCases, ...repositories],
})
export class AuthModule {}
