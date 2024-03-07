import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IAuthRepository } from '../domain/repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { VerificationCode } from '../domain/entities/validation-code';
import { CreateUser } from '../domain/entities/create-user';
import { AccessToken } from '../domain/entities/access-token';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: IAuthRepository,
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async register(data: CreateUser): Promise<VerificationCode> {
    const { email, password } = data;
    const user = await this.authRepository.findUserByEmail(email);
    if (user?.hasConfirmedEmail === true) {
      throw new ConflictException('email already registered');
    }
    if (user?.hasConfirmedEmail === false) {
      throw new BadRequestException(
        'Please check your email, your verification code has already been sent',
      );
    }
    return this.createUser(email, password);
  }

  async confirmAccount(code: string): Promise<AccessToken> {
    const user = await this.authRepository.findUserByVerificationCode(code);
    if (!user) {
      throw new ForbiddenException('Código inválido');
    }
    if (user.hasConfirmedEmail === true) {
      throw new BadRequestException('Correo ya confirmado');
    }
    const verifiedUser = await this.authRepository.validateAccount(user.id);
    const payload = { username: verifiedUser.email, sub: verifiedUser.id };

    return this.authService.createAccessToken(payload);
  }

  private async createUser(
    email: string,
    password: string,
  ): Promise<VerificationCode> {
    const encryptedPassword = this.authService.encryptPassword(password);
    const user = await this.authRepository.createUser(email, encryptedPassword);
    const randomCode =
      await this.verificationCodeRepository.generateVerificationCode();
    return this.verificationCodeRepository.createVerificationCode(
      user.id,
      randomCode,
    );
  }
}
