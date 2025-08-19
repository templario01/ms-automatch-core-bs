import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { EnvConfigService } from '../../../../core/settings/env-config.service';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private readonly envConfigService: EnvConfigService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.envConfigService.jwtConfig.google.clientId,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}
