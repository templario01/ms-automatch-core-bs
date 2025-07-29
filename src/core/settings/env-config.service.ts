import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get app() {
    return {
      port: this.configService.get<number>('PORT'),
      environment: this.configService.get<string>('NODE_ENV'),
    };
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expirationTime: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    };
  }

  get soldInventoryConfig() {
    return {
      liveLivenessTimeInMinutes: this.configService.get<string>('LIVE_LIVENESS_TIME_IN_MINUTES'),
    };
  }
}
