import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthRepository } from '../domain/repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { VerificationCode } from '../domain/entities/validation-code';
import { CreateUser } from '../domain/entities/create-user';
import { AccessToken } from '../domain/entities/access-token';
import { ClientProxy } from '@nestjs/microservices';
import { AUTOMATCH_NOTIFICATION_SERVICE } from '../../../core/event-broker/dtos/services';
import { lastValueFrom, tap } from 'rxjs';
import { UserSignIn } from '../domain/entities/sign-in';
import { obfuscateEmail } from 'src/core/utils/obfuscate.utils';

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);

  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: IAuthRepository,
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    @Inject(AUTOMATCH_NOTIFICATION_SERVICE)
    private notificationClient: ClientProxy,
  ) {}

  async login(data: UserSignIn): Promise<AccessToken> {
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
    return this.registerNewSession(user.id, user.email, userAgent);
  }

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
    const user =
      await this.authRepository.findUserWithActiveVerificationCode(code);
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

  async resendEmailVerification(email: string): Promise<VerificationCode> {
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

    return this.createNewVerificationCode(user.email);
  }

  private async registerNewSession(
    userId: string,
    email: string,
    userAgent: string,
  ): Promise<AccessToken> {
    const payload = { username: email, sub: userId };
    await this.authRepository.registerSession(userId);
    this.logger.verbose(
      `New session registered: ${JSON.stringify({ userId, userAgent })}`,
    );
    return this.authService.createAccessToken(payload);
  }

  private async createUser(
    email: string,
    password: string,
  ): Promise<VerificationCode> {
    const encryptedPassword = await this.authService.encryptPassword(password);
    const user = await this.authRepository.createUser(email, encryptedPassword);
    return this.createNewVerificationCode(user.email);
  }

  private async createNewVerificationCode(
    email: string,
  ): Promise<VerificationCode> {
    const randomCode =
      await this.verificationCodeRepository.generateVerificationCode();
    const payload = Buffer.from(
      JSON.stringify({ email, verificationCode: randomCode }),
    ).toString('base64');
    await lastValueFrom(
      this.notificationClient.emit('notify_verification_code', payload).pipe(
        tap(() => {
          this.logger.verbose(
            `[Producer] Sending new verification code to: ${obfuscateEmail(email)}`,
          );
        }),
      ),
    );
    return this.verificationCodeRepository.createVerificationCode(
      email,
      randomCode,
    );
  }
}
