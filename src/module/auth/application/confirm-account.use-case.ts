import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/auth.repository';
import { AccessToken } from '../domain/entities/access-token';
import { VerifyAuthCode } from '../domain/entities/verify-auth-code';
import { AuthService } from './services/auth.service';

@Injectable()
export class ConfirmAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: VerifyAuthCode): Promise<AccessToken> {
    const user = await this.userRepository.findUserWithActiveVerificationCode(
      data.email,
      data.code,
    );
    if (!user) {
      throw new ForbiddenException('Código inválido');
    }
    if (user.hasConfirmedEmail === true) {
      throw new BadRequestException('Correo ya confirmado');
    }
    const verifiedUser = await this.userRepository.validateAccount(user.id);
    const payload = {
      username: verifiedUser.email,
      sub: verifiedUser.id,
      accountId: verifiedUser.account.id,
    };

    return this.authService.createAccessToken(payload);
  }
}
