import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from '../../domain/entities/access-token';
import { EnvConfigService } from '../../../../core/settings/env-config.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  public async encryptPassword(pass: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(pass, salt);
  }

  public comparePasswords(
    password: string,
    savedPassword: string,
  ): Promise<boolean> {
    return compare(password, savedPassword);
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
}
