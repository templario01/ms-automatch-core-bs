import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '../../../../../core/settings/env-config.service';
import { IAuthRepository } from 'src/module/auth/domain/repositories/auth.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly userRepository: IAuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getContext(context);
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.envConfigService.jwtConfig.secret,
      });
      const user = await this.userRepository.findUserByEmail(payload.email);
      if (!user || user.hasConfirmedEmail === false) {
        throw new Error('Cuenta no verificada o usuario inválido');
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private getContext(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
