import { EmailVerificationCode } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { NotificationStatus } from '../../infrastructure/prisma-verification-code.repository';

export class VerificationCode {
  readonly id: string;
  readonly notificationStatus: NotificationStatus;
  readonly expirationTime: Date;
  readonly createdAt: Date;

  static mapToDto(data: EmailVerificationCode): VerificationCode {
    return plainToInstance(VerificationCode, {
      id: data.id,
      notificationStatus: data.notificationStatus,
      expirationTime: data.expirationTime,
      createdAt: data.createdAt,
    });
  }
}
