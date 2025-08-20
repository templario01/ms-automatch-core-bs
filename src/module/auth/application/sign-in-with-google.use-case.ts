import { Injectable, Logger } from '@nestjs/common';
import { AuthProvider } from '../domain/entities/auth-provider';
import { IUserRepository } from '../domain/repositories/auth.repository';
import { GoogleSignInDto } from '../infrastructure/input/dtos/request/google-sign-in.dto';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google.auth.service';

@Injectable()
export class SignInWithGoogleUseCase {
  private readonly logger = new Logger(SignInWithGoogleUseCase.name);
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(googleSignInDto: GoogleSignInDto) {
    const { idToken } = googleSignInDto;
    const googleUser = await this.googleAuthService.verifyIdToken(idToken);

    let user = await this.userRepository.findUserByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepository.createUserByExternalProvider(
        googleUser.email,
        AuthProvider.GOOGLE,
      );
    }

    const payload = {
      username: user.email,
      sub: user.id,
      accountId: user.account.id,
    };
    await this.userRepository.registerSession(user.id);
    this.logger.verbose(
      `New session registered: ${JSON.stringify({ userId: user.id })} by Google Sign-In`,
    );

    return this.authService.createAccessToken(payload);
  }
}
