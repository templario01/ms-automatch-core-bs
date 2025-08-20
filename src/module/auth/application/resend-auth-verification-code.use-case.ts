import { BadRequestException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/auth.repository';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { VerificationCode } from '../domain/entities/validation-code';
import { SendAuthVerificationCodeUseCase } from './send-auth-verification-code.use-case';

@Injectable()
export class ResendAuthVerificationCodeUseCase {
  constructor(
    private readonly authRepository: IUserRepository,
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    private readonly sendAuthVerificationCodeUseCase: SendAuthVerificationCodeUseCase,
  ) {}

  async execute(email: string): Promise<VerificationCode> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'Por favor regresa al step 1 del formulario de creación de cuenta y registra tu correo',
      );
    }
    if (user.hasConfirmedEmail === true) {
      throw new BadRequestException('Correo electrónico ya validado');
    }
    const activeCodes = await this.verificationCodeRepository.findActiveCodes(
      user.id,
    );
    if (activeCodes.length > 0) {
      throw new BadRequestException(
        'Ya solicitaste un código, debes esperar 2 minutos para solitar un nuevo código',
      );
    }

    return this.sendAuthVerificationCodeUseCase.execute(user.email);
  }
}
