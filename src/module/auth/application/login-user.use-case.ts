import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSignIn } from '../domain/entities/sign-in';
import { AccessToken } from '../domain/entities/access-token';
import { AuthService } from './services/auth.service';
import { IUserRepository } from '../domain/repositories/auth.repository';

@Injectable()
export class LoginUserUseCase {
  private readonly logger = new Logger(LoginUserUseCase.name);
  constructor(
    private readonly authRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: UserSignIn): Promise<AccessToken> {
    const { email, password, userAgent } = data;
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña no válidos',
      );
    }
    if (user.hasConfirmedEmail === false) {
      throw new BadRequestException(
        '¡Ups!, parece que aún no haz verificado tu cuenta',
      );
    }
    const isValidPassword = await this.authService.comparePasswords(
      password,
      user.encryptedPassword,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Contraseña inválida');
    }
    return this.registerNewSession(
      user.id,
      user.email,
      user.account.id,
      userAgent,
    );
  }

  private async registerNewSession(
    userId: string,
    email: string,
    accountId: string,
    userAgent: string,
  ): Promise<AccessToken> {
    const payload = { username: email, sub: userId, accountId };
    await this.authRepository.registerSession(userId);
    this.logger.verbose(
      `New session registered: ${JSON.stringify({ userId, userAgent })}`,
    );
    return this.authService.createAccessToken(payload);
  }
}
