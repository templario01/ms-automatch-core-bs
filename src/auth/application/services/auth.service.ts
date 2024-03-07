import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { AccessToken } from '../../domain/entities/access-token';
import { EnvConfigService } from '../../../core/settings/env-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  public encryptPassword(pass: string): string {
    const salt = this.generateSalt();
    const hashedPassword = this.hashPassword(pass, salt);
    return hashedPassword;
  }

  public comparePasswords(
    inputPassword: string,
    hashedPassword: string,
    salt: string,
  ): boolean {
    const inputHashedPassword = this.hashPassword(inputPassword, salt);
    return inputHashedPassword === hashedPassword;
  }

  public async createAccessToken(
    payload: Record<string, unknown>,
  ): Promise<AccessToken> {
    const accessToken = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
    });
    return {
      token: accessToken,
      tokenType: 'Bearer',
      expiresIn: this.envConfigService.jwtConfig.expirationTime,
    };
  }

  private generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  private hashPassword(password: string, salt: string): string {
    const hash = createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
  }
}
