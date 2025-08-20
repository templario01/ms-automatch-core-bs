import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/auth.repository';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { AUTOMATCH_EMAIL_NOTIFICATION } from '../../../core/event-broker/dtos/services';
import { ClientProxy } from '@nestjs/microservices';
import { VerificationCode } from '../domain/entities/validation-code';
import { lastValueFrom, tap } from 'rxjs';
import { NOTIFY_USER_EMAIL_ROUTING_KEY } from '../../../core/event-broker/constants/routing-key';
import { obfuscateEmail } from '../../../core/utils/obfuscate.utils';

@Injectable()
export class SendAuthVerificationCodeUseCase {
  private readonly logger = new Logger(SendAuthVerificationCodeUseCase.name);
  constructor(
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    @Inject(AUTOMATCH_EMAIL_NOTIFICATION)
    private notificationClient: ClientProxy,
  ) {}

  async execute(email: string): Promise<VerificationCode> {
    const randomCode =
      await this.verificationCodeRepository.generateVerificationCode();
    const payload = Buffer.from(
      JSON.stringify({
        email,
        subject: 'Código de verificación Automatch',
        body: { verificationCode: randomCode },
        templateId: 'confirmationUserEmail',
      }),
    ).toString('base64');
    await lastValueFrom(
      this.notificationClient.emit(NOTIFY_USER_EMAIL_ROUTING_KEY, payload).pipe(
        tap(() => {
          this.logger.verbose(
            `[Producer] Publish to routingKey=${NOTIFY_USER_EMAIL_ROUTING_KEY} verification code ${randomCode} for email: ${obfuscateEmail(email)} `,
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
