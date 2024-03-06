import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { IAuthRepository } from '../domain/repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { VerificationCode } from '../domain/entities/validation-code';
import { CreateUser } from '../domain/entities/create-user';

@Injectable()
export class AuthUseCase {
  constructor(
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

  private async createUser(
    email: string,
    password: string,
  ): Promise<VerificationCode> {
    const encryptedPassword = AuthService.encryptPassword(password);
    const user = await this.authRepository.createUser(email, encryptedPassword);
    const randomCode =
      await this.verificationCodeRepository.generateVerificationCode();
    return this.verificationCodeRepository.createVerificationCode(
      user.id,
      randomCode,
    );
  }
}
